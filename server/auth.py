"""
Auth — JWT creation/verification + cookie encryption
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
    if os.environ.get("RAILWAY_ENVIRONMENT"):
        print("FATAL: FERNET_KEY env var not set.", file=sys.stderr)
        sys.exit(1)
    else:
        print("⚠️  WARNING: FERNET_KEY not set. Using temp key — sessions reset on restart!")
        _FERNET_KEY = Fernet.generate_key().decode()

_FERNET = Fernet(_FERNET_KEY.encode() if isinstance(_FERNET_KEY, str) else _FERNET_KEY)

# ─── JWT — 365 day expiry so user is NEVER logged out ────────────────────────
JWT_EXPIRE_DAYS = 365

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
