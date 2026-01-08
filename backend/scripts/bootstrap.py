"""
Backend Bootstrap / Health-Check Script
- Validates .env variables
- Initializes Django safely
- Verifies DB, Redis, Celery, Caching, and frontend folder
- Fails fast with readable errors
- Modular, production-ready
"""

import os
import sys
from pathlib import Path

# --- Utility for clean error exits ---
def fail(msg: str):
    """Prints a clean error and exits."""
    print(f"[BOOTSTRAP ERROR] {msg}", file=sys.stderr)
    sys.exit(1)

# --- 1. Validate required .env variables ---
def check_env_vars(required_vars=None):
    """Fail if any required environment variable is missing."""
    if required_vars is None:
        required_vars = [
            'DJANGO_SETTINGS_MODULE',
            'DATABASE_URL',
            'REDIS_URL',
            'CELERY_BROKER_URL',
        ]
    missing = [v for v in required_vars if not os.getenv(v)]
    if missing:
        fail(f"Missing required environment variables: {', '.join(missing)}")

# --- 2. Initialize Django safely ---
def safe_django_setup():
    """Initializes Django, failing fast on error."""
    try:
        import django
        django.setup()
    except Exception as e:
        fail(f"Django initialization failed: {e}")

# --- 3. Verify database connectivity ---
def check_db():
    """Checks all Django DB connections."""
    try:
        from django.db import connections
        for conn in connections.all():
            conn.ensure_connection()
    except Exception as e:
        fail(f"Database connectivity check failed: {e}")

# --- 4. Verify Redis connectivity ---
def check_redis():
    """Checks Redis connection using REDIS_URL."""
    try:
        import redis
        from django.conf import settings
        url = os.getenv('REDIS_URL') or getattr(settings, 'REDIS_URL', None)
        if not url:
            fail("REDIS_URL not set in environment or settings.")
        r = redis.Redis.from_url(url)
        r.ping()
    except Exception as e:
        fail(f"Redis connectivity check failed: {e}")

# --- 5. Verify Celery broker and workers ---
def check_celery():
    """Checks Celery broker and ensures at least one worker is active."""
    try:
        from celery import Celery
        from django.conf import settings
        broker_url = os.getenv('CELERY_BROKER_URL') or getattr(settings, 'CELERY_BROKER_URL', None)
        if not broker_url:
            fail("CELERY_BROKER_URL not set in environment or settings.")
        app = Celery(broker=broker_url)
        insp = app.control.inspect(timeout=5)
        active = insp.active() or {}
        if not active:
            fail("No active Celery workers found.")
    except Exception as e:
        fail(f"Celery broker/workers check failed: {e}")

# --- 6. Confirm frontend/ folder exists ---
def check_frontend_folder():
    """Checks that the frontend/ folder exists at project root."""
    root = Path(__file__).resolve().parent.parent
    frontend = root / 'frontend'
    if not frontend.exists() or not frontend.is_dir():
        fail("frontend/ folder missing. Required for integration.")

# --- 7. Validate caching layer read/write ---
def check_cache():
    """Checks Django cache backend for read/write capability."""
    try:
        from django.core.cache import cache
        cache.set('bootstrap_test', 'ok', timeout=10)
        val = cache.get('bootstrap_test')
        if val != 'ok':
            fail("Cache read/write test failed.")
    except Exception as e:
        fail(f"Cache layer check failed: {e}")

# --- 8. Add slow query detection and logging ---
def enable_slow_query_logging(threshold_ms=200):
    """Enables logging for slow DB queries (for performance tuning)."""
    try:
        import logging
        import time
        from django.db.backends.utils import CursorWrapper
        orig_execute = CursorWrapper.execute
        def execute(self, sql, params=None):
            start = time.time()
            try:
                return orig_execute(self, sql, params)
            finally:
                elapsed = (time.time() - start) * 1000
                if elapsed > threshold_ms:
                    logging.warning(f"Slow query ({elapsed:.1f}ms): {sql}")
        CursorWrapper.execute = execute
    except Exception as e:
        print(f"[WARN] Slow query logging not enabled: {e}")

# --- 9. Tune Celery async task settings ---
def tune_celery():
    """Sets Celery settings for production readiness."""
    try:
        from django.conf import settings
        # Example: set acks_late and prefetch
        setattr(settings, 'CELERY_TASK_ACKS_LATE', True)
        setattr(settings, 'CELERYD_PREFETCH_MULTIPLIER', 1)
        # Add more tuning as needed
    except Exception as e:
        print(f"[WARN] Celery tuning not applied: {e}")

# --- MAIN ---
def main():
    """Runs all bootstrap checks in order."""
    check_env_vars()
    safe_django_setup()
    enable_slow_query_logging()
    check_db()
    check_redis()
    check_celery()
    check_frontend_folder()
    check_cache()
    tune_celery()
    print("[BOOTSTRAP SUCCESS] All checks passed. Ready to start server.")

if __name__ == "__main__":
    main()
