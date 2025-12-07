import sys
import os

# Add backend_python to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend_python'))

from app import app

if __name__ == "__main__":
    app.run()
