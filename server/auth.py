"""
Auth — JWT creation/verification + cookie encryption
"""
import os
import json
from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from cryptography.fernet import Fernet

# ─── Keys (set in environment) ────────────────────────────────────────────────
# Generate once with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
JWT_SECRET  = os.environ.get("JWT_SECRET", "CHANGE_ME_IN_PRODUCTION_USE_RANDOM_32_CHARS")
FERNET_KEY  = os.environ.get("FERNET_KEY", "").encode()

# Fallback dev key (DO NOT use in prod)
_DEV_FERNET = Fernet.generate_key()

def _fernet() -> Fernet:
    key = FERNET_KEY if FERNET_KEY else _DEV_FERNET
    return Fernet(key)

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
    """Encrypt cookie dict → base64 string for DB storage"""
    raw = json.dumps(cookies).encode()
    return _fernet().encrypt(raw).decode()

def decrypt_cookies(encrypted: str) -> dict:
    """Decrypt stored cookie string → dict"""
    raw = _fernet().decrypt(encrypted.encode())
    return json.loads(raw)
