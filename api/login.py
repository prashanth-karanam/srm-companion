import os
import sys

# Ensure local api folder is in path for both serverless and module execution
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from index import handler
except ImportError:
    from .index import handler

