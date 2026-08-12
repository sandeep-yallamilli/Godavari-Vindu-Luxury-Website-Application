#!/usr/bin/env python
"""
Automated Supabase Migration & Data Seeding Helper Script
Run this script to initialize or update your Supabase PostgreSQL database.
"""
import os
import sys

# Ensure UTF-8 output handling on Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import django

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "godavari_vindu.settings")

try:
    django.setup()
except Exception as e:
    print(f"[ERROR] Failed to initialize Django settings: {e}")
    sys.exit(1)

from django.core.management import call_command
from django.db import connection, DatabaseError, OperationalError, Error
from menu.models import Category, MenuItem, SiteAsset

def main():
    print("==================================================")
    print("[INIT] Godavari Vindu Luxury - Supabase Database Setup")
    print("==================================================")

    # 1. Test connection
    try:
        connection.ensure_connection()
        print("[SUCCESS] Connected to database backend!")
    except (DatabaseError, OperationalError, Error, Exception) as err:
        print(f"[ERROR] Could not connect to Supabase database. Details:\n{err}")
        print("\n[HINT] Please check your DATABASE_URL in backend/.env")
        print("Example format: postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres")
        sys.exit(1)

    # 2. Run Database Migrations
    print("\n[MIGRATING] Running database migrations...")
    try:
        call_command('migrate', interactive=False)
        print("[SUCCESS] Database migrations completed successfully!")
    except Exception as err:
        print(f"[ERROR] Migration failed: {err}")
        sys.exit(1)

    # 3. Check and Load Initial Data Fixtures
    category_count = Category.objects.count()
    menu_count = MenuItem.objects.count()
    asset_count = SiteAsset.objects.count()

    print(f"\n[STATUS] Current DB status: {category_count} categories, {menu_count} menu items, {asset_count} site assets.")

    if category_count == 0 or menu_count == 0:
        print("\n[SEEDING] Database is empty or incomplete. Populating initial data from initial_data.json...")
        try:
            call_command('loaddata', 'initial_data.json')
            print(f"[SUCCESS] Initial data loaded successfully! New totals:")
            print(f"   - Categories: {Category.objects.count()}")
            print(f"   - Menu Items: {MenuItem.objects.count()}")
            print(f"   - Site Assets: {SiteAsset.objects.count()}")
        except Exception as err:
            print(f"[WARNING] Error loading initial_data.json: {err}")
    else:
        print("[INFO] Data already exists in database. Skipping initial data reload.")

    print("\n==================================================")
    print("[COMPLETE] Supabase Database Setup Finished!")
    print("==================================================")

if __name__ == "__main__":
    main()
