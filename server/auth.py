"""
Auth — JWT creation/verification + cookie encryption
Fix #3: Crash loudly if FERNET_KEY missing — no silent per-restart key change
"""
import os
import json
from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from cryptography.fernet import Fernet

# ─── Keys (MUST be set in environment) ───────────────────────────────────────
JWT_SECRET = os.environ.get("JWT_SECRET", "CHANGE_ME_IN_PRODUCTION_USE_RANDOM_32_CHARS")
_FERNET_KEY = os.environ.get("FERNET_KEY", "")

if not _FERNET_KEY:
    import sys
    # In production (Railway), crash immediately so the problem is obvious
    if os.environ.get("RAILWAY_ENVIRONMENT"):
        print("FATAL: FERNET_KEY env var not set. Set it in Railway dashboard.", file=sys.stderr)
        sys.exit(1)
    else:
        # Dev only: generate a stable key for the session and warn loudly
        print("⚠️  WARNING: FERNET_KEY not set. Using temp key — all sessions reset on restart!")
        print("   Run: python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\"")
        print("   Then add FERNET_KEY=<output> to your .env file")
        _FERNET_KEY = Fernet.generate_key().decode()

_FERNET = Fernet(_FERNET_KEY.encode() if isinstance(_FERNET_KEY, str) else _FERNET_KEY)

# ─── JWT ──────────────────────────────────────────────────────────────────────
JWT_EXPIRE_DAYS = 7

def create_token(srm_id: str) -> str:
    payload = {
        "sub": srm_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRE_DAYS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except JWTError:
        return None

# ─── Cookie encryption ────────────────────────────────────────────────────────
def encrypt_cookies(cookies: dict) -> str:
    raw = json.dumps(cookies).encode()
    return _FERNET.encrypt(raw).decode()

def decrypt_cookies(encrypted: str) -> dict:
    raw = _FERNET.decrypt(encrypted.encode())
    return json.loads(raw)
