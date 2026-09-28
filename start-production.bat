@echo off
title ROOT CO. - Production Build + Preview
cd /d "%~dp0"
echo.
echo  Building ROOT CO....
call npm run build
echo.
echo  Serving production build at http://localhost:4173
echo  (Close this window to stop the server)
echo.
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:4173"
npm run preview