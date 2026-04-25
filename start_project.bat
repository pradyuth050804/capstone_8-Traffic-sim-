@echo off
color 0A
title RoadSim - Traffic AI System
echo ===================================================
echo     Starting RoadSim Traffic AI Platform
echo ===================================================
echo.

:: Check for the virtual environment OR assume global python
echo [1/3] Verifying environment...
cd /d "%~dp0"

echo.
echo [2/3] Starting Flask ML Backend (app.py) in a new window...
:: Starts the Flask API in a separate Command Prompt window
start "Flask ML Backend" cmd /k "python api\app.py"

echo.
echo [3/3] Starting React Frontend (Vite)...
echo Close this window to stop the frontend.
echo ===================================================
:: Keeps the frontend in the current terminal window
npm run dev

pause
