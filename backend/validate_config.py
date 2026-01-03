#!/usr/bin/env python
"""
Configuration validator for SatyaCheck backend.
Validates .env, settings, and project structure.
"""

import os
import sys
from pathlib import Path

def check_env_file():
    """Check if .env file exists and has required variables."""
    print("\n📋 Checking .env file...")
    
    env_path = Path('.env')
    if not env_path.exists():
        print("❌ .env file not found")
        print("   Solution: Copy .env.example to .env and update values")
        return False
    
    required_vars = [
        'SECRET_KEY',
        'DEBUG',
        'DB_ENGINE',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'DB_HOST',
        'REDIS_URL',
        'JWT_SECRET_KEY',
        'ALLOWED_HOSTS'
    ]
    
    with open('.env') as f:
        env_content = f.read()
    
    missing = []
    for var in required_vars:
        if f'{var}=' not in env_content:
            missing.append(var)
    
    if missing:
        print(f"❌ Missing required variables: {', '.join(missing)}")
        return False
    
    print("✓ .env file is complete")
    return True


def check_dependencies():
    """Check if all dependencies are installed."""
    print("\n📦 Checking dependencies...")
    
    required = [
        'django',
        'djangorestframework',
        'psycopg2',
        'redis',
        'celery',
        'torch',
        'transformers',
        'beautifulsoup4'
    ]
    
    missing = []
    for package in required:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing.append(package)
    
    if missing:
        print(f"❌ Missing packages: {', '.join(missing)}")
        print(f"   Solution: pip install {' '.join(missing)}")
        return False
    
    print("✓ All dependencies installed")
    return True


def check_directory_structure():
    """Check if all required directories exist."""
    print("\n📁 Checking directory structure...")
    
    required_dirs = [
        'satyacheck',
        'satyacheck/apps',
        'satyacheck/apps/users',
        'satyacheck/apps/submissions',
        'satyacheck/apps/ai',
        'satyacheck/apps/admin_panel',
        'satyacheck/apps/reporting',
        'satyacheck/services',
        'satyacheck/utils',
        'scripts',
        'logs',
        'media'
    ]
    
    missing = []
    for dir_name in required_dirs:
        if not Path(dir_name).exists():
            missing.append(dir_name)
    
    if missing:
        print(f"❌ Missing directories: {', '.join(missing)}")
        return False
    
    print("✓ Directory structure is complete")
    return True


def check_files():
    """Check if all critical files exist."""
    print("\n📄 Checking critical files...")
    
    required_files = [
        'manage.py',
        'requirements.txt',
        '.env.example',
        'satyacheck/core/settings.py',
        'satyacheck/core/urls.py',
        'satyacheck/core/wsgi.py',
        'satyacheck/core/asgi.py',
        'satyacheck/apps/users/models.py',
        'satyacheck/apps/submissions/models.py',
        'satyacheck/apps/ai/models.py',
        'satyacheck/services/ai_service.py',
        'satyacheck/services/web_scraper.py',
        'docker-compose.yml',
        'Dockerfile',
        'README.md'
    ]
    
    missing = []
    for file_name in required_files:
        if not Path(file_name).exists():
            missing.append(file_name)
    
    if missing:
        print(f"❌ Missing files: {', '.join(missing)}")
        return False
    
    print("✓ All critical files present")
    return True


def check_database():
    """Check if database is accessible."""
    print("\n🗄️  Checking database connection...")
    
    try:
        import django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'satyacheck.core.settings')
        django.setup()
        
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
        
        print("✓ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        print("   Solution: Check DB credentials in .env and ensure PostgreSQL is running")
        return False


def check_redis():
    """Check if Redis is accessible."""
    print("\n🔴 Checking Redis connection...")
    
    try:
        import redis
        from django.conf import settings
        
        r = redis.from_url(settings.REDIS_URL)
        r.ping()
        
        print("✓ Redis connection successful")
        return True
    except Exception as e:
        print(f"❌ Redis connection failed: {str(e)}")
        print("   Solution: Check REDIS_URL in .env and ensure Redis is running")
        return False


def check_permissions():
    """Check if necessary permissions are set."""
    print("\n🔐 Checking permissions...")
    
    writable_dirs = ['media', 'logs']
    
    all_ok = True
    for dir_name in writable_dirs:
        path = Path(dir_name)
        if not path.exists():
            path.mkdir(parents=True, exist_ok=True)
        
        if not os.access(path, os.W_OK):
            print(f"❌ {dir_name} is not writable")
            all_ok = False
    
    if all_ok:
        print("✓ All directories have proper permissions")
    
    return all_ok


def main():
    """Run all validation checks."""
    print("=" * 60)
    print("🔍 SatyaCheck Backend Configuration Validator")
    print("=" * 60)
    
    checks = [
        ('Directory Structure', check_directory_structure),
        ('Critical Files', check_files),
        ('.env File', check_env_file),
        ('Dependencies', check_dependencies),
        ('Permissions', check_permissions),
    ]
    
    results = []
    for name, check in checks:
        try:
            result = check()
            results.append((name, result))
        except Exception as e:
            print(f"❌ Error during {name} check: {str(e)}")
            results.append((name, False))
    
    # Optional checks
    try:
        db_ok = check_database()
        results.append(('Database', db_ok))
    except:
        results.append(('Database', False))
    
    try:
        redis_ok = check_redis()
        results.append(('Redis', redis_ok))
    except:
        results.append(('Redis', False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Validation Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓" if result else "❌"
        print(f"{status} {name}")
    
    print(f"\nPassed: {passed}/{total}")
    
    if passed == total:
        print("\n✅ All checks passed! Backend is ready to run.")
        print("\nNext steps:")
        print("1. python manage.py migrate")
        print("2. python scripts/setup.py")
        print("3. python manage.py runserver")
        return 0
    else:
        print("\n⚠️  Some checks failed. Please review the errors above.")
        print("\nCommon solutions:")
        print("1. Create .env: cp .env.example .env")
        print("2. Install dependencies: pip install -r requirements.txt")
        print("3. Start PostgreSQL: sudo systemctl start postgresql")
        print("4. Start Redis: redis-server")
        return 1


if __name__ == '__main__':
    sys.exit(main())
