@echo off
echo ===================================================
echo MaskPro Biometric Kiosk - Auto Setup for Windows
echo ===================================================
echo.

:: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed! Please download and install Node.js from https://nodejs.org/ first.
    pause
    exit /b
)

:: Install PM2 globally
echo [1/4] Installing PM2 (Process Manager) globally...
call npm install -g pm2

:: Install local dependencies
echo [2/4] Installing local node modules...
call npm install

:: Add to PM2 and Startup
echo [3/4] Adding Biometric Bridge to PM2 background services...
call pm2 start index.js --name "maskpro-kiosk"
call pm2 save
call pm2 startup

:: Create Desktop Shortcut for Chrome Kiosk
echo [4/4] Creating Kiosk Startup Shortcut for Chrome...
set "VBS_SCRIPT=%TEMP%\create_shortcut.vbs"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_FOLDER%\MaskProKiosk.lnk"

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%VBS_SCRIPT%"
echo sLinkFile = "%SHORTCUT_PATH%" >> "%VBS_SCRIPT%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%VBS_SCRIPT%"
:: Path to standard Chrome installation
echo oLink.TargetPath = "C:\Program Files\Google\Chrome\Application\chrome.exe" >> "%VBS_SCRIPT%"
:: Arguments to launch Kiosk
echo oLink.Arguments = "--kiosk http://localhost:3000" >> "%VBS_SCRIPT%"
echo oLink.Description = "MaskPro Biometric Kiosk Display" >> "%VBS_SCRIPT%"
echo oLink.Save >> "%VBS_SCRIPT%"

cscript /nologo "%VBS_SCRIPT%"
del "%VBS_SCRIPT%"

echo.
echo ===================================================
echo Setup Complete!
echo.
echo The Node server is now running in the background.
echo A shortcut has been added to your Windows Startup folder.
echo Next time you restart the PC, Chrome will automatically
echo open in full-screen Kiosk mode!
echo.
echo To see it right now, manually open Chrome and go to:
echo http://localhost:3000
echo ===================================================
pause
