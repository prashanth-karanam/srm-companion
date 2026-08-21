"""
SRM Companion - One-time Credential Setup
Run this ONCE to save your SRM login details securely on your PC.
Your credentials are stored ONLY in credentials.json on this machine.
They are never sent anywhere except directly to academia.srmist.edu.in
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import os
import json
import getpass

CREDENTIALS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "credentials.json")

def setup():
    print()
    print("=" * 55)
    print("  SRM COMPANION — CREDENTIAL SETUP")
    print("=" * 55)
    print("  Your credentials are saved ONLY on this PC.")
    print("  They are used ONLY to login to academia.srmist.edu.in")
    print("  Nothing is sent to any external server.")
    print("=" * 55)
    print()

    username = input("  Enter your SRM Email (e.g. RA2611026010283@srmist.edu.in): ").strip()
    if not username:
        print("ERROR: Username cannot be empty.")
        return

    # Add @srmist.edu.in if user only typed registration number
    if "@" not in username:
        username = username + "@srmist.edu.in"
        print(f"  Auto-formatted to: {username}")

    password = getpass.getpass("  Enter your SRM Portal Password: ")
    if not password:
        print("ERROR: Password cannot be empty.")
        return

    creds = {
        "username": username,
        "password": password
    }

    with open(CREDENTIALS_FILE, "w", encoding="utf-8") as f:
        json.dump(creds, f, indent=2)

    print()
    print(f"  ✅ Credentials saved to: {CREDENTIALS_FILE}")
    print()
    print("  Next step: Run the scraper to test login:")
    print("    python srm_scraper.py --visible")
    print()
    print("  Or start the full backend with auto-scraping:")
    print("    python backend_server.py")
    print()

if __name__ == "__main__":
    setup()
