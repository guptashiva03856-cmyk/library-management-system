@echo off
cd /d "%~dp0"

:: Start JSON Server
echo Starting json-server...
start "JSON Server" cmd /k "json-server --watch library.json --port 8000"

:: Start FastAPI Services
echo Starting FastAPI Services...
start "Books API" cmd /k "uvicorn Books_api:app --reload --port 8001"
start "Authors API" cmd /k "uvicorn Authors_api:app --reload --port 8002"
start "Members API" cmd /k "uvicorn Members_api:app --reload --port 8003"

:: Start Python HTTP Server
echo Starting Python HTTP Server on port 5000...
start "Python HTTP Server" cmd /k "python -m http.server 5000 --bind 127.0.0.1"

echo.
echo ========================================
echo Services are starting...
echo ----------------------------------------
echo JSON Server:    http://localhost:8000
echo Books API:     http://localhost:8001
echo Authors API:   http://localhost:8002
echo Members API:   http://localhost:8003
echo Frontend:      http://localhost:5000
echo ========================================
echo.
echo If you see any errors in the command windows,
echo please check that all required services are running.
echo.
echo Press any key to stop all services...
pause >nul

:: Clean up
echo.
echo Stopping all services...
taskkill /f /im python.exe /t >nul 2>&1
taskkill /f /im uvicorn.exe /t >nul 2>&1
taskkill /f /im node.exe /t >nul 2>&1

echo All services have been stopped.
pause
