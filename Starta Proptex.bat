@echo off
REM Dubbelklicka for att oppna sidan pa Windows.
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js saknas. Installera det fran https://nodejs.org (valj LTS) och dubbelklicka igen.
  start "" https://nodejs.org
  pause
  exit /b 1
)
node scripts\start.mjs
pause
