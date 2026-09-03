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
        self._student_cache_ttl = 1800 # 30 minutes
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
        return None

    def delete_captcha_session(self, session_id: str):
        if self._redis_client:
            try:
                self._redis_client.delete(f"srm:captcha:{session_id}")
            except Exception:
                pass
        self._captcha_sessions.pop(session_id, None)

    # ─── Student Data Caching (3000-User Scale Optimization) ──────────────────
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
        return None

    def invalidate_student_data(self, srm_id: str):
        clean_id = srm_id.strip().lower()
        if self._redis_client:
            try:
                self._redis_client.delete(f"srm:student:{clean_id}")
            except Exception:
                pass
        self._student_cache.pop(clean_id, None)

    # ─── Housekeeping ─────────────────────────────────────────────────────────
    def _cleanup_expired_captcha(self):
        now = time.time()
        expired = [k for k, v in self._captcha_sessions.items() if now - v.get("created_at", 0) >= self._captcha_ttl]
        for k in expired:
            self._captcha_sessions.pop(k, None)

# Global singleton
session_manager = SessionManager()
