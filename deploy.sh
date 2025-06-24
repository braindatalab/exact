#!/bin/bash
# This is a simple deployment script for a Linux server.
# It pulls the latest code, installs dependencies, and runs database migrations.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting deployment ---"

# 1. Pull the latest code from the main branch of your repository
echo "Step 1: Pulling latest code from repository..."
git pull origin main

# 2. Install or update Python dependencies
# Assumes you have a requirements.txt file and are in a virtual environment
echo "Step 2: Installing/updating dependencies..."
pip install -r platform/backend/requirements.txt

# 3. Apply database migrations
# This will create the database schema on a new DB or update an existing one.
echo "Step 3: Applying database migrations..."
python3 platform/backend/manage.py migrate

# Optional: You could add other steps here, like:
# echo "Collecting static files..."
# python3 platform/backend/manage.py collectstatic --noinput
#
# echo "Restarting application server..."
# sudo systemctl restart your-gunicorn-service

echo "--- Deployment finished successfully! ---" 