#!/usr/bin/env bash
# Vercel Build Script for Django Backend
echo "Starting Vercel build process..."

# Install Python requirements
python3 -m pip install -r requirements.txt

# Collect static files for WhiteNoise
python3 manage.py collectstatic --noinput

echo "Vercel build complete!"
