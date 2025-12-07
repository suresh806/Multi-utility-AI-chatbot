#!/bin/bash

# Run both React and Python services on macOS/Linux
# This script starts the React frontend and Python backend

echo ""
echo "==================================="
echo "AI Chat App - Startup Script"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed"
    echo "Please install Python from https://python.org/"
    exit 1
fi

echo "[OK] Node.js found: $(node --version)"
echo "[OK] Python found: $(python3 --version)"

echo ""
echo "Starting services..."
echo ""

# Install React dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[Installing] React dependencies..."
    npm install
fi

# Create Python virtual environment if needed
if [ ! -d "backend_python/venv" ]; then
    echo "[Creating] Python virtual environment..."
    cd backend_python
    python3 -m venv venv
    cd ..
fi

# Activate virtual environment and check if requirements are installed
cd backend_python
source venv/bin/activate
pip list | grep -q Flask
if [ $? -ne 0 ]; then
    echo "[Installing] Python dependencies..."
    pip install -r requirements.txt
fi

# Check if database exists
if [ ! -f "app.db" ]; then
    echo "[Creating] Database..."
    python -c "from app import app, db; app.app_context().push(); db.create_all()" || {
        echo "[ERROR] Failed to initialize database"
        exit 1
    }
    echo "[OK] Database created"
fi

cd ..

echo ""
echo "==================================="
echo "Starting React Frontend..."
echo "==================================="
echo "[URL] http://localhost:3000"
echo ""

# Start React in background
npm start &
REACT_PID=$!

echo ""
echo "Waiting for React to start..."
sleep 5

echo ""
echo "==================================="
echo "Starting Python Backend..."
echo "==================================="
echo "[URL] http://localhost:5000"
echo ""

# Start Python backend in background
cd backend_python
source venv/bin/activate
python app.py &
PYTHON_PID=$!
cd ..

echo ""
echo "==================================="
echo "Services Started!"
echo "==================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for either process to exit
wait -n
EXITCODE=$?

# Kill both processes on exit
kill $REACT_PID $PYTHON_PID 2>/dev/null

echo ""
echo "Services stopped."
exit $EXITCODE
