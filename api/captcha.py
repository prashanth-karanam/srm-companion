import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from index import handler
except ImportError:
    from .index import handler
