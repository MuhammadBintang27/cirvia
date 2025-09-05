@echo off
echo ========================================
echo CV Practicum Dependencies Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python tidak ditemukan!
    echo Silakan install Python terlebih dahulu dari https://python.org
    echo.
    pause
    exit /b 1
)

echo ✅ Python ditemukan
python --version

echo.
echo 🔧 Memulai instalasi dependencies...
echo.

REM Run the Python setup script
python setup_dependencies.py

echo.
echo ========================================
echo Setup selesai!
echo ========================================
echo.
echo Anda sekarang dapat menjalankan CV Practicum
echo melalui platform Cirvia.
echo.
pause
