#!/bin/bash
# Quick start script for SatyaCheck Backend

echo "🚀 Starting SatyaCheck Backend Setup..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python $python_version"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run setup script
echo "Running setup..."
python scripts/setup.py

# Instructions
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Start the services in separate terminals:"
echo ""
echo "1. Start Redis:"
echo "   redis-server"
echo ""
echo "2. Start Celery worker:"
echo "   celery -A satyacheck worker -l info"
echo ""
echo "3. Start Celery beat:"
echo "   celery -A satyacheck beat -l info"
echo ""
echo "4. Start Django development server:"
echo "   python manage.py runserver"
echo ""
echo "Admin panel: http://localhost:8000/admin/"
echo "API: http://localhost:8000/api/v1/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
