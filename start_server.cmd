@echo off
title SRM Companion Multi-Cloud Scraper Backend Server
cls
echo ============================================================
echo   SRM COMPANION MULTI-CLOUD SCRAPER BACKEND SERVER
echo ============================================================
echo.
echo [1/2] Checking Python environment...
python --version
if %errorlevel% neq 0 (
    echo [ERROR] Python not found in PATH!
    pause
    exit /b 1
)

echo.
echo [2/2] Starting SRM Companion Backend Server on Port 8000...
echo.
echo   Local Web Access: http://localhost:8000
echo   LAN Mobile Access: http://172.16.0.2:8000
echo   API Status Check: http://localhost:8000/api/status
echo   Live CAPTCHA:     http://localhost:8000/api/captcha
echo.
echo Press Ctrl+C at any time to stop the server.
echo ============================================================
echo.

python backend_server.py
pause
