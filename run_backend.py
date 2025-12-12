#!/usr/bin/env python
"""
Run the Flask backend server
"""
import os
import sys

# Add backend_python to path
backend_path = os.path.join(os.path.dirname(__file__), 'backend_python')
sys.path.insert(0, backend_path)

# Set environment
os.environ['FLASK_APP'] = 'app.py'
os.environ['FLASK_ENV'] = 'development'

# Import and run app
os.chdir(backend_path)
from app import app

if __name__ == '__main__':
    print("Starting Flask backend on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
