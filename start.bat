@echo off
echo ================================================
echo  Fraud Guard - Starting Backend and Frontend
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again
    pause
    exit /b 1
)

echo [1/4] Checking backend dependencies...
cd backend

if not exist "saved_models\autoencoder_model.pth" (
    echo [WARNING] Model files not found. Please train the model first:
    echo   python models/train_model.py
    echo.
)

if not exist "results.db" (
    echo [INFO] Database will be created on first run
)

echo [2/4] Starting Flask Backend on port 5000...
start "Fraud Guard Backend" cmd /k "python app.py"

echo [3/4] Waiting for backend to start...
timeout /t 5 /nobreak >nul

cd ..\frontend

echo [4/4] Starting React Frontend...
if exist "node_modules" (
    echo [INFO] Dependencies found, starting dev server...
) else (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

start "Fraud Guard Frontend" cmd /k "npm run dev"

echo.
echo ================================================
echo  Both servers are starting!
echo ================================================
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173 (check terminal for actual port)
echo.
echo  Press Ctrl+C in each terminal window to stop the servers
echo ================================================
echo.
pause
