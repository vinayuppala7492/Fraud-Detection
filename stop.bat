@echo off
echo Stopping all Fraud Guard servers...
taskkill /FI "WindowTitle eq Fraud Guard Backend*" /T /F 2>nul
taskkill /FI "WindowTitle eq Fraud Guard Frontend*" /T /F 2>nul
echo Done!
pause
