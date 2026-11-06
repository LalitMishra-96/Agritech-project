@echo off
title AgriSmart AI - Server Launcher
color 0A

echo ============================================================
echo      AgriSmart AI - Smart Agriculture Assistant
echo      Developer: Lalit Mishra
echo ============================================================
echo.

set PYTHON_EXE=C:\Users\lalit\AppData\Local\Programs\Python\Python312\python.exe

if not exist "%PYTHON_EXE%" (
    echo [ERROR] Python was not found at:
    echo %PYTHON_EXE%
    echo Please verify your Python installation path.
    pause
    exit /b 1
)

echo [INFO] Checking Python environment...
"%PYTHON_EXE%" --version
if errorlevel 1 (
    echo [ERROR] Failed to execute Python.
    pause
    exit /b 1
)

echo.
echo [INFO] Checking if Flask backend is already running on port 5000...
netstat -ano | findstr /R /C:":5000 " >nul
if not errorlevel 1 (
    echo [STATUS] Flask server is ALREADY RUNNING on http://127.0.0.1:5000
    goto OPEN_FRONTEND
)

echo [STATUS] Starting Flask Backend Server on http://127.0.0.1:5000...
start "AgriSmart AI Backend" "%PYTHON_EXE%" backend\app.py

timeout /t 3 /nobreak >nul

:OPEN_FRONTEND
echo.
echo ============================================================
echo [SUCCESS] Backend is ready at: http://127.0.0.1:5000
echo ============================================================
echo.
echo Frontend Options:
echo   1. Live Server (VS Code): http://127.0.0.1:5500/frontend/index.html
echo   2. Direct Browser: Double click frontend\index.html
echo.
echo Press any key to open the frontend in your default browser...
pause >nul

start "" "%~dp0frontend\index.html"
