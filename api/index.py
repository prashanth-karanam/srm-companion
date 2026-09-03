import sys
import os

# Add server directory to sys.path so app, scraper_engine, session_manager are importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "server"))

from app import app
