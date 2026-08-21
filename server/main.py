"""
SRM Companion — FastAPI Backend
Multi-user, multi-platform. Each student logs in with their own SRM ID + password.
"""
import sys
if hasattr(sys.stdout, 'reconfigure'):
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

import asyncio
import json
from datetime import datetime

from fastapi import FastAPI, Depends, HTTPException, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from auth import create_token, verify_token, encrypt_cookies, decrypt_cookies
from db import get_user, save_user, upsert_scraped_data
from scraper import stealth_login, scrape_with_cookies, test_session

# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="SRM Companion API", version="2.0.0")

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
        raise HTTPException(401, "Token expired or invalid — please log in again")
    return payload["sub"]

# ─── Background: scrape data for a user ──────────────────────────────────────
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
async def login(req: LoginReq, bg: BackgroundTasks):
    srm_id = req.srm_id.strip().lower().replace("@srmist.edu.in", "")
    password = req.password.strip()

    if not srm_id or not password:
        raise HTTPException(400, "SRM ID and password are required")

    # 1 — Check if user has a cached valid session
    user = await get_user(srm_id)
    if user and user.get("srm_cookies"):
        cookies = decrypt_cookies(user["srm_cookies"])
        if await test_session(cookies):
            # Session still good — return token immediately
            token = create_token(srm_id)
            # Still refresh data in background
            bg.add_task(scrape_task, srm_id, cookies)
            return {"success": True, "token": token, "cached": True}

    # 2 — Need a fresh browser login (stealth Playwright)
    result = await stealth_login(srm_id, password)
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
        raise HTTPException(404, "No data found — please sync")
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
    cookies = decrypt_cookies(user["srm_cookies"])
    bg.add_task(scrape_task, srm_id, cookies)
    return {"success": True, "message": "Sync started in background"}


@app.get("/health")
async def health():
    return {"status": "ok", "time": datetime.now().isoformat()}


# ─── Background mass-refresh every 15 min ────────────────────────────────────
@app.on_event("startup")
async def start_refresh_loop():
    asyncio.create_task(mass_refresh_loop())

async def mass_refresh_loop():
    """Re-scrape all active users every 15 minutes"""
    from db import get_all_users
    await asyncio.sleep(60)  # Wait 1 min before first run
    while True:
        try:
            users = await get_all_users()
            print(f"[AutoRefresh] Refreshing {len(users)} users...")
            for u in users:
                if u.get("srm_cookies"):
                    cookies = decrypt_cookies(u["srm_cookies"])
                    asyncio.create_task(scrape_task(u["srm_id"], cookies))
                    await asyncio.sleep(5)  # Stagger to avoid hammering portal
        except Exception as e:
            print(f"[AutoRefresh] Error: {e}")
        await asyncio.sleep(900)  # 15 min
