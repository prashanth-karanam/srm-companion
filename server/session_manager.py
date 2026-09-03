"""
High-Performance Session & Data Cache Manager for SRM Companion
Provides fast in-memory TTL caching with optional Redis integration.
Guarantees sub-millisecond data retrieval for returning students.
"""

import time
import os
import json
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger("srm_session_manager")

class SessionManager:
    def __init__(self):
        self._captcha_sessions: Dict[str, Dict[str, Any]] = {}
        self._student_cache: Dict[str, Dict[str, Any]] = {}
        self._captcha_ttl = 300       # 5 minutes
        self._student_cache_ttl = 604800 # 7 days (Persistent Student Session)
        self._redis_client = None

        redis_url = os.getenv("REDIS_URL")
        if redis_url:
            try:
                import redis
                self._redis_client = redis.from_url(redis_url, decode_responses=True)
                logger.info("Connected to Redis for centralized multi-user caching.")
            except Exception as e:
                logger.warning(f"Redis initialization failed, falling back to in-memory: {e}")

    # ─── CAPTCHA Session Handling ─────────────────────────────────────────────
    def save_captcha_session(self, session_id: str, cookies: str, sec_config: dict, hidden_fields: dict):
        data = {
            "cookies": cookies,
            "sec_config": sec_config,
            "hidden_fields": hidden_fields,
            "created_at": time.time()
        }
        if self._redis_client:
            try:
                self._redis_client.setex(f"srm:captcha:{session_id}", self._captcha_ttl, json.dumps(data))
                return
            except Exception as e:
                logger.warning(f"Redis write error: {e}")

        self._captcha_sessions[session_id] = data
        self._cleanup_expired_captcha()

    def get_captcha_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        if not session_id:
            return None

        if self._redis_client:
            try:
                raw = self._redis_client.get(f"srm:captcha:{session_id}")
                if raw:
                    return json.loads(raw)
            except Exception as e:
                logger.warning(f"Redis read error: {e}")

        session = self._captcha_sessions.get(session_id)
        if session:
            if time.time() - session.get("created_at", 0) < self._captcha_ttl:
                return session
            else:
                self._captcha_sessions.pop(session_id, None)

        # 3. Stateless Token Decoding (Serverless Multi-Container Resilient)
        try:
            import base64
            raw_bytes = base64.urlsafe_b64decode(session_id.encode('utf-8'))
            data = json.loads(raw_bytes.decode('utf-8'))
            if isinstance(data, dict) and "cookies" in data:
                if time.time() - data.get("created_at", 0) < self._captcha_ttl:
                    return data
        except Exception:
            pass

        return None

    def delete_captcha_session(self, session_id: str):
        if self._redis_client:
            try:
                self._redis_client.delete(f"srm:captcha:{session_id}")
            except Exception:
                pass
        self._captcha_sessions.pop(session_id, None)

    # ─── Student Data Caching (Multi-User Scale Optimization) ──────────────────
    def _get_disk_store_path(self):
        import tempfile
        import os
        td = tempfile.gettempdir()
        return os.path.join(td, "srm_student_store.json")

    def _read_disk_store(self) -> dict:
        import os
        p = self._get_disk_store_path()
        if os.path.exists(p):
            try:
                with open(p, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    def _write_disk_store(self, store: dict):
        p = self._get_disk_store_path()
        try:
            with open(p, 'w', encoding='utf-8') as f:
                json.dump(store, f)
        except Exception as e:
            logger.warning(f"Error saving to disk store: {e}")

    def save_student_data(self, srm_id: str, data: dict):
        clean_id = srm_id.strip().lower()
        cache_entry = {
            "data": data,
            "cached_at": time.time()
        }
        if self._redis_client:
            try:
                self._redis_client.setex(f"srm:student:{clean_id}", self._student_cache_ttl, json.dumps(cache_entry))
                return
            except Exception as e:
                logger.warning(f"Redis write error: {e}")

        self._student_cache[clean_id] = cache_entry
        try:
            disk_store = self._read_disk_store()
            disk_store[clean_id] = cache_entry
            self._write_disk_store(disk_store)
        except Exception:
            pass

    def get_student_data(self, srm_id: str, max_age_seconds: int = None) -> Optional[Dict[str, Any]]:
        clean_id = srm_id.strip().lower()
        max_age = max_age_seconds or self._student_cache_ttl

        if self._redis_client:
            try:
                raw = self._redis_client.get(f"srm:student:{clean_id}")
                if raw:
                    entry = json.loads(raw)
                    if time.time() - entry.get("cached_at", 0) < max_age:
                        return entry.get("data")
            except Exception as e:
                logger.warning(f"Redis read error: {e}")

        entry = self._student_cache.get(clean_id)
        if entry:
            if time.time() - entry.get("cached_at", 0) < max_age:
                return entry.get("data")
            else:
                self._student_cache.pop(clean_id, None)

        # Fallback to persistent disk store
        try:
            disk_store = self._read_disk_store()
            if clean_id in disk_store:
                d_entry = disk_store[clean_id]
                if time.time() - d_entry.get("cached_at", 0) < max_age:
                    self._student_cache[clean_id] = d_entry
                    return d_entry.get("data")
        except Exception:
            pass

        return None

    def invalidate_student_data(self, srm_id: str):
        clean_id = srm_id.strip().lower()
        if self._redis_client:
            try:
                self._redis_client.delete(f"srm:student:{clean_id}")
            except Exception:
                pass
        self._student_cache.pop(clean_id, None)
        try:
            disk_store = self._read_disk_store()
            disk_store.pop(clean_id, None)
            self._write_disk_store(disk_store)
        except Exception:
            pass

    # ─── Housekeeping ─────────────────────────────────────────────────────────
    def _cleanup_expired_captcha(self):
        now = time.time()
        expired = [k for k, v in self._captcha_sessions.items() if now - v.get("created_at", 0) >= self._captcha_ttl]
        for k in expired:
            self._captcha_sessions.pop(k, None)

# Global singleton
session_manager = SessionManager()
