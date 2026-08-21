"""
DB — Supabase PostgreSQL layer
"""
import os
from datetime import datetime, timezone
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

_client: Client | None = None

def db() -> Client:
    global _client
    if not _client:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise RuntimeError("SUPABASE_URL and SUPABASE_KEY env vars not set")
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client

async def get_user(srm_id: str) -> dict | None:
    res = db().table("users").select("*").eq("srm_id", srm_id).execute()
    return res.data[0] if res.data else None

async def save_user(srm_id: str, encrypted_cookies: str):
    db().table("users").upsert({
        "srm_id": srm_id,
        "srm_cookies": encrypted_cookies,
        "last_login": datetime.now(timezone.utc).isoformat(),
    }).execute()

async def upsert_scraped_data(srm_id: str, data: dict):
    db().table("users").update({
        "scraped_data": data,
        "last_scraped": datetime.now(timezone.utc).isoformat(),
    }).eq("srm_id", srm_id).execute()

async def get_all_users() -> list[dict]:
    res = db().table("users").select("srm_id, srm_cookies").execute()
    return res.data or []

# Fix #11: Only return users active within a given cutoff datetime string
async def get_active_users(since: str) -> list[dict]:
    res = (
        db().table("users")
        .select("srm_id, srm_cookies")
        .gte("last_login", since)
        .execute()
    )
    return res.data or []
