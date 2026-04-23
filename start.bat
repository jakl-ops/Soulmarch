@echo off
setlocal

set "APP_DIR=%~dp0"
set "NODE_EXE=E:\Node\node.exe"
set "APP_URL=http://localhost:3000"

if not exist "%NODE_EXE%" (
  echo Could not find Node at "%NODE_EXE%".
  echo Update start.bat if your Node install moved.
  pause
  exit /b 1
)

pushd "%APP_DIR%"
start "Soulmarch Server" cmd /k ""%NODE_EXE%" server.js"
timeout /t 2 /nobreak >nul
start "" "%APP_URL%"
popd

endlocal
