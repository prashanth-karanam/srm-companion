"""
SRM Companion — FastAPI Backend
Fixes:
  #5  — async httpx instead of blocking requests
  #8  — per-user login semaphore (multi-user concurrent login)
  #11 — mass_refresh capped: only last-7-day users, max 3 concurrent
  #12 — rate limiting on /api/login (5 per IP per minute)
"""
import sys
if hasattr(sys.stdout, 'reconfigure'):
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

import asyncio
import re
from datetime import datetime, timezone, timedelta

from fastapi import FastAPI, Depends, HTTPException, Header, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from auth import create_token, verify_token, encrypt_cookies, decrypt_cookies
from db import get_user, save_user, upsert_scraped_data, get_active_users
from scraper import stealth_login, scrape_with_cookies, test_session

# ─── Rate limiter ─────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="SRM Companion API", version="2.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Models ───────────────────────────────────────────────────────────────────
class LoginReq(BaseModel):
    srm_id: str
    password: str

# ─── Auth dependency ──────────────────────────────────────────────────────────
async def current_user(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing Bearer token")
    payload = verify_token(authorization[7:])
    if not payload:
        raise HTTPException(401, "Token expired — please log in again")
    return payload["sub"]

# ─── Background scrape for one user ──────────────────────────────────────────
async def scrape_task(srm_id: str, cookies: dict):
    try:
        data = await scrape_with_cookies(cookies)
        if data:
            await upsert_scraped_data(srm_id, data)
            print(f"[Scraper] ✅ {srm_id} — {len(data.get('attendance', []))} subjects")
    except Exception as e:
        print(f"[Scraper] ❌ {srm_id} — {e}")

# ─── Endpoints ────────────────────────────────────────────────────────────────
@app.post("/api/login")
@limiter.limit("5/minute")  # Fix #12: brute-force protection
async def login(request: Request, req: LoginReq, bg: BackgroundTasks):
    srm_id = req.srm_id.strip().lower().replace("@srmist.edu.in", "")
    password = req.password.strip()

    # Fix #10: validate ID format
    if not srm_id or not password:
        raise HTTPException(400, "SRM ID and password are required")
    if not re.match(r'^[a-z]{2}\d{4}$', srm_id):
        raise HTTPException(400, "Invalid SRM ID format (expected e.g. sk1325)")

    # Check cached session first
    user = await get_user(srm_id)
    if user and user.get("srm_cookies"):
        try:
            cookies = decrypt_cookies(user["srm_cookies"])
            if await test_session(cookies):
                token = create_token(srm_id)
                bg.add_task(scrape_task, srm_id, cookies)
                return {"success": True, "token": token, "cached": True}
        except Exception:
            pass  # Decryption failed (old key) — re-login

    # Fresh browser login with 60s hard timeout (Fix #8: per-user lock inside scraper)
    try:
        result = await asyncio.wait_for(stealth_login(srm_id, password), timeout=60)
    except asyncio.TimeoutError:
        raise HTTPException(408, "SRM portal is slow right now — try again in 30 seconds")

    if not result["success"]:
        raise HTTPException(401, result.get("error", "Invalid SRM ID or password"))

    cookies = result["cookies"]
    await save_user(srm_id, encrypt_cookies(cookies))

    token = create_token(srm_id)
    bg.add_task(scrape_task, srm_id, cookies)
    return {"success": True, "token": token, "cached": False}


@app.get("/api/me/data")
async def get_data(srm_id: str = Depends(current_user)):
    user = await get_user(srm_id)
    if not user:
        raise HTTPException(404, "No data — please tap Sync Portal")
    return {
        "success": True,
        "data": user.get("scraped_data") or {},
        "last_scraped": user.get("last_scraped"),
    }


@app.post("/api/me/sync")
async def force_sync(bg: BackgroundTasks, srm_id: str = Depends(current_user)):
    user = await get_user(srm_id)
    if not user or not user.get("srm_cookies"):
        raise HTTPException(400, "No session — log in again")
    try:
        cookies = decrypt_cookies(user["srm_cookies"])
    except Exception:
        raise HTTPException(400, "Session expired — log in again")
    bg.add_task(scrape_task, srm_id, cookies)
    return {"success": True, "message": "Sync started"}


@app.get("/api/announcements")
async def get_announcements(srm_id: str = Depends(current_user)):
    # Stub — returns empty (WhatsApp ingestion optional add-on)
    return {"success": True, "announcements": [], "overrides": []}


@app.get("/health")
async def health():
    return {"status": "ok", "time": datetime.now().isoformat()}


# ─── Background mass-refresh every 15 min ────────────────────────────────────
_REFRESH_POOL = asyncio.Semaphore(3)  # Fix #11: max 3 scrapes at once

@app.on_event("startup")
async def start_refresh_loop():
    asyncio.create_task(mass_refresh_loop())

async def mass_refresh_loop():
    """Re-scrape only active users (logged in within 7 days) every 15 min. Max 3 concurrent."""
    await asyncio.sleep(90)  # Let server fully boot first
    while True:
        try:
            # Fix #11: Only refresh recent users
            cutoff = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
            users = await get_active_users(since=cutoff)
            print(f"[AutoRefresh] Refreshing {len(users)} active users...")

            async def _refresh_one(u):
                async with _REFRESH_POOL:
                    try:
                        cookies = decrypt_cookies(u["srm_cookies"])
                        await scrape_task(u["srm_id"], cookies)
                    except Exception as e:
                        print(f"[AutoRefresh] {u['srm_id']} failed: {e}")

            await asyncio.gather(*[_refresh_one(u) for u in users if u.get("srm_cookies")])

        except Exception as e:
            print(f"[AutoRefresh] Error: {e}")

        await asyncio.sleep(900)  # 15 min
