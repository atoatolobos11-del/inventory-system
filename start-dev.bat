@echo off
title ROOT CO. - Dev Server
cd /d "%~dp0"
echo.
echo  Starting ROOT CO. dev server...
echo  Dashboard: http://localhost:5173
echo  (Close this window to stop the server)
echo.
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"
npm run dev