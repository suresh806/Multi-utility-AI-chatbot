@echo off
REM Run both React and Python services on Windows
REM This script starts the React frontend and Python backend

echo.
echo ===================================
echo AI Chat App - Startup Script
echo ===================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
where node

echo [OK] Python found: 
where python

echo.
echo Starting services...
echo.

REM Install React dependencies if needed
if not exist "node_modules" (
    echo [Installing] React dependencies...
    call npm install
)

REM Create Python virtual environment if needed
if not exist "backend_python\venv" (
    echo [Creating] Python virtual environment...
    cd backend_python
    python -m venv venv
    cd ..
)

REM Check if requirements are installed
cd backend_python
python -m pip list | find "Flask" >nul
if %errorlevel% neq 0 (
    echo [Installing] Python dependencies...
    call venv\Scripts\pip install -r requirements.txt
)

REM Check if database exists
if not exist "app.db" (
    echo [Creating] Database...
    python -c "from app import app, db; app.app_context().push(); db.create_all()" || (
        echo [ERROR] Failed to initialize database
        pause
        exit /b 1
    )
    echo [OK] Database created
)

cd ..

echo.
echo ===================================
echo Starting React Frontend...
echo ===================================
echo [URL] http://localhost:3000
echo.

REM Start React in new window
start "React Frontend" cmd /k npm start

echo.
echo Waiting for React to start...
timeout /t 5

echo.
echo ===================================
echo Starting Python Backend...
echo ===================================
echo [URL] http://localhost:5000
echo.

REM Start Python backend in new window
start "Python Backend" cmd /k "cd backend_python && venv\Scripts\activate && python app.py"

echo.
echo ===================================
echo Services Started!
echo ===================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Close any window to stop the service.
echo Close both windows to stop the application.
echo.
pause
