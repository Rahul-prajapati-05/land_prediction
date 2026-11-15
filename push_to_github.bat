@echo off
setlocal
echo ============================================================
echo      Upload HomePrice AI Project to GitHub
echo ============================================================
echo.

set DEFAULT_USER=Rahul-prajapati-05
set /p REPO_NAME="Enter your GitHub Repository Name (e.g. house-price-prediction): "

if "%REPO_NAME%"=="" (
    echo [!] No repository name entered. Defaulting to 'house-price-prediction'...
    set REPO_NAME=house-price-prediction
)

echo.
echo [+] Setting remote origin to: https://github.com/%DEFAULT_USER%/%REPO_NAME%.git
git remote remove origin 2>nul
git remote add origin https://github.com/%DEFAULT_USER%/%REPO_NAME%.git

echo [+] Ensuring branch is main...
git branch -M main

echo [+] Pushing commits to GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ============================================================
    echo [SUCCESS] Your project is now live on GitHub!
    echo URL: https://github.com/%DEFAULT_USER%/%REPO_NAME%
    echo ============================================================
) else (
    echo.
    echo [!] If push failed:
    echo     1. Make sure you created the empty repo at https://github.com/new
    echo     2. Ensure you are logged into GitHub in your terminal/browser.
)

echo.
pause
