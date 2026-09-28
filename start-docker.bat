@echo off
title ROOT CO. - Docker
cd /d "%~dp0"
echo.
echo  Make sure Docker Desktop is running first!
echo  Building image...
docker build -t inventory360 .
if errorlevel 1 (
  echo.
  echo  Build failed. Is Docker Desktop running?
  pause
  exit /b 1
)
echo.
echo  Starting container on http://localhost:8080 ...
docker rm -f inventory360-app >nul 2>&1
docker run -d -p 8080:80 --name inventory360-app inventory360
start http://localhost:8080
echo  Done. Stop it later with:  docker stop inventory360-app
pause