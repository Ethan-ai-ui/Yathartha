#!/usr/bin/env python
"""
Setup script for SatyaCheck backend.
Initializes database, creates superuser, and loads initial data.
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'satyacheck.core.settings')
sys.path.insert(0, str(Path(__file__).resolve().parent))
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model
from satyacheck.apps.submissions.models import SourceDatabase

User = get_user_model()


def run_migrations():
    """Run database migrations."""
    print("Running migrations...")
    call_command('migrate')
    print("✓ Migrations complete")


def create_superuser():
    """Create superuser if not exists."""
    print("\nCreating superuser...")
    
    if User.objects.filter(username='admin').exists():
        print("✓ Superuser 'admin' already exists")
        return
    
    User.objects.create_superuser(
        username='admin',
        email='admin@satyacheck.com',
        password='admin123',
        first_name='Admin',
        last_name='User',
        role='admin'
    )
    print("✓ Superuser 'admin' created (username: admin, password: admin123)")
    print("⚠️  Change password immediately!")


def load_trusted_sources():
    """Load initial trusted sources."""
    print("\nLoading trusted sources...")
    
    sources = [
        # International News
        {
            'name': 'BBC News',
            'url': 'https://www.bbc.com/news',
            'source_type': 'news',
            'country': 'int',
            'credibility_score': 85,
            'language': 'en',
            'description': 'British Broadcasting Corporation - Global news'
        },
        {
            'name': 'Reuters',
            'url': 'https://www.reuters.com',
            'source_type': 'news',
            'country': 'int',
            'credibility_score': 85,
            'language': 'en',
            'description': 'International news agency'
        },
        {
            'name': 'Associated Press',
            'url': 'https://apnews.com',
            'source_type': 'news',
            'country': 'us',
            'credibility_score': 85,
            'language': 'en',
            'description': 'American news agency'
        },
        {
            'name': 'Al Jazeera',
            'url': 'https://www.aljazeera.com',
            'source_type': 'news',
            'country': 'int',
            'credibility_score': 80,
            'language': 'en',
            'description': 'International news network'
        },
        {
            'name': 'The Guardian',
            'url': 'https://www.theguardian.com',
            'source_type': 'news',
            'country': 'int',
            'credibility_score': 80,
            'language': 'en',
            'description': 'British newspaper'
        },
        
        # Nepal Sources
        {
            'name': 'Setopati',
            'url': 'https://www.setopati.com',
            'source_type': 'news',
            'country': 'np',
            'credibility_score': 75,
            'language': 'ne',
            'description': 'Nepali news portal'
        },
        {
            'name': 'Kantipur News',
            'url': 'https://www.kantipurdaily.com',
            'source_type': 'news',
            'country': 'np',
            'credibility_score': 75,
            'language': 'ne',
            'description': 'Leading Nepali newspaper'
        },
        {
            'name': 'Ekantipur',
            'url': 'https://www.ekantipur.com',
            'source_type': 'news',
            'country': 'np',
            'credibility_score': 75,
            'language': 'ne',
            'description': 'Nepali news and information'
        },
        {
            'name': 'The Himalayan Times',
            'url': 'https://thehimalayantimes.com',
            'source_type': 'news',
            'country': 'np',
            'credibility_score': 75,
            'language': 'en',
            'description': 'English language news from Nepal'
        },
        {
            'name': 'My Republica',
            'url': 'https://www.myrepublica.com',
            'source_type': 'news',
            'country': 'np',
            'credibility_score': 70,
            'language': 'en',
            'description': 'Nepali news website'
        },
        
        # Fact-Checking
        {
            'name': 'Snopes',
            'url': 'https://www.snopes.com',
            'source_type': 'fact_check',
            'country': 'us',
            'credibility_score': 90,
            'language': 'en',
            'description': 'Urban legends and rumor verification'
        },
        {
            'name': 'FactCheck.org',
            'url': 'https://www.factcheck.org',
            'source_type': 'fact_check',
            'country': 'us',
            'credibility_score': 90,
            'language': 'en',
            'description': 'Non-partisan fact-checking'
        },
        {
            'name': 'PolitiFact',
            'url': 'https://www.politifact.com',
            'source_type': 'fact_check',
            'country': 'us',
            'credibility_score': 85,
            'language': 'en',
            'description': 'Political fact-checking'
        },
        
        # Government
        {
            'name': 'Government of Nepal',
            'url': 'https://www.nepal.gov.np',
            'source_type': 'government',
            'country': 'np',
            'credibility_score': 95,
            'language': 'ne',
            'description': 'Official government portal'
        },
        {
            'name': 'Nepal COVID-19 Dashboard',
            'url': 'https://covid19.mohp.gov.np',
            'source_type': 'government',
            'country': 'np',
            'credibility_score': 95,
            'language': 'ne',
            'description': 'Official COVID-19 information'
        },
    ]
    
    count = 0
    for source_data in sources:
        source, created = SourceDatabase.objects.get_or_create(
            name=source_data['name'],
            url=source_data['url'],
            defaults=source_data
        )
        if created:
            count += 1
    
    print(f"✓ Loaded {count} trusted sources")


def create_ai_models():
    """Create AI model entries."""
    print("\nCreating AI models...")
    
    from satyacheck.apps.ai.models import AIModel, ModelConfiguration
    
    models_data = [
        {
            'name': 'DistilBERT',
            'version': '1.0',
            'model_type': 'text_classification',
            'description': 'Fine-tuned DistilBERT for misinformation detection',
            'accuracy': 0.92,
            'is_active': True,
            'is_production': True,
        },
    ]
    
    count = 0
    for model_data in models_data:
        model, created = AIModel.objects.get_or_create(
            name=model_data['name'],
            defaults=model_data
        )
        
        if created:
            # Create default configuration
            ModelConfiguration.objects.create(model=model)
            count += 1
    
    print(f"✓ Created {count} AI models")


def main():
    """Run all setup tasks."""
    print("=" * 60)
    print("SatyaCheck Backend Setup")
    print("=" * 60)
    
    try:
        run_migrations()
        create_superuser()
        load_trusted_sources()
        create_ai_models()
        
        print("\n" + "=" * 60)
        print("✓ Setup complete!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Start Redis: redis-server")
        print("2. Start Celery: celery -A satyacheck worker -l info")
        print("3. Start Celery Beat: celery -A satyacheck beat -l info")
        print("4. Start Django: python manage.py runserver")
        print("\nAdmin credentials:")
        print("  Username: admin")
        print("  Password: admin123")
        print("  URL: http://localhost:8000/admin/")
        print("=" * 60)
    
    except Exception as e:
        print(f"\n✗ Setup failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
