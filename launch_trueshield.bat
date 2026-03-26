@echo off
setlocal
echo ===================================================
echo     TrueShield Intelligence Platform Bootstrapper
echo ===================================================
echo.

:: 1. Start Python AI Microservice (Port 8000)
echo [1/3] Starting TrueShield AI NLP Engine...
start cmd /k "cd ai && if not exist venv (echo ERROR: Run python -m venv venv first && pause) else (set PYTHONIOENCODING=utf-8 && .\venv\Scripts\activate && uvicorn main:app --port 8000 --reload)"

:: Wait a second
timeout /t 2 /nobreak >nul

:: 2. Start Node.js API (Port 5000)
echo [2/3] Starting TrueShield Node.js Express Backend...
start cmd /k "cd backend && npm run dev"

:: Wait a second
timeout /t 2 /nobreak >nul

:: 3. Start React Web Client (Port 5173)
echo [3/3] Starting TrueShield UX Client...
start cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo     ALL SYSTEMS NOMINAL.
echo     Frontend: http://localhost:5173
echo     Backend:  http://localhost:5000
echo     AI Node:  http://localhost:8000
echo ===================================================
echo.
pause
