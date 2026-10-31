@echo off
title Krishinova Platform Runner
echo ========================================================
echo             KRISHINOVA FARMING PLATFORM
echo ========================================================
echo.

:: 1. Ensure Ollama is running in the background
start "" /B ollama serve >nul 2>&1

:: 2. Check and start Python ML backend if not already running on port 8000
netstat -ano | findstr :8000 | findstr LISTENING >nul
if %errorlevel% neq 0 (
    echo [1/2] Starting Python ML Backend on port 8000...
    start "Krishinova ML Backend (FastAPI)" cmd /k "py backend/main.py"
) else (
    echo [1/2] Python ML Backend is already active on port 8000.
)

:: 3. Check and start Next.js frontend if not already running on port 3000
netstat -ano | findstr :3000 | findstr LISTENING >nul
if %errorlevel% neq 0 (
    echo [2/2] Starting Next.js Web Frontend on port 3000...
    start "Krishinova Frontend (Next.js)" cmd /k "npm run dev"
) else (
    echo [2/2] Next.js Web Frontend is already active on port 3000.
)

echo.
echo ========================================================
echo Krishinova is ready!
echo.
echo - Web Application:   http://localhost:3000
echo - ML Backend Docs:   http://localhost:8000/docs
echo - Ollama AI Service: http://localhost:11434
echo ========================================================
echo.
timeout /t 3 >nul
start http://localhost:3000
