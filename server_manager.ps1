# PowerShell Server Management Script for Cirvia + CV
# Usage: .\server_manager.ps1

Write-Host "🚀 Cirvia + CV Server Management" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Function to check if port is in use
function Test-Port {
    param([int]$Port, [string]$ServiceName)
    
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Host "✅ $ServiceName is running on port $Port" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $ServiceName is not running on port $Port" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ $ServiceName is not running on port $Port" -ForegroundColor Red
        return $false
    }
}

# Function to kill processes on port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        foreach ($process in $processes) {
            $pid = $process.OwningProcess
            Write-Host "🔪 Killing process $pid on port $Port" -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    } catch {
        Write-Host "No processes found on port $Port" -ForegroundColor Yellow
    }
}

# Check current status
Write-Host "`n📊 Current Status:" -ForegroundColor Yellow
$nextjsRunning = Test-Port -Port 3000 -ServiceName "Next.js"
$flaskRunning = Test-Port -Port 5000 -ServiceName "Flask CV Server"

Write-Host "`n🎯 Available Commands:" -ForegroundColor Yellow
Write-Host "1. Start Next.js only"
Write-Host "2. Start Flask CV only" 
Write-Host "3. Start both servers"
Write-Host "4. Stop all servers"
Write-Host "5. Restart everything"
Write-Host "6. Show status"
Write-Host "7. Quick fix - Stop Python and restart"
Write-Host "8. Open browsers"

$choice = Read-Host "`nEnter choice (1-8)"

switch ($choice) {
    "1" {
        Write-Host "🌐 Starting Next.js..." -ForegroundColor Green
        Set-Location "f:\LIDM\20225\project LIDM\cirvia"
        npm run dev
    }
    "2" {
        Write-Host "🤖 Starting Flask CV Server..." -ForegroundColor Green
        Set-Location "f:\LIDM\20225\project LIDM\cirvia\src\app\practicum\cv-circuit"
        python web_cv_server.py
    }
    "3" {
        Write-Host "🚀 Starting both servers..." -ForegroundColor Green
        
        # Start Next.js in background
        Write-Host "Starting Next.js in background..."
        $nextjsJob = Start-Job -ScriptBlock {
            Set-Location "f:\LIDM\20225\project LIDM\cirvia"
            npm run dev
        }
        
        Start-Sleep -Seconds 3
        
        # Start Flask CV Server in foreground
        Write-Host "Starting Flask CV Server..."
        Set-Location "f:\LIDM\20225\project LIDM\cirvia\src\app\practicum\cv-circuit"
        python web_cv_server.py
    }
    "4" {
        Write-Host "🛑 Stopping all servers..." -ForegroundColor Red
        Stop-ProcessOnPort -Port 3000
        Stop-ProcessOnPort -Port 5000
        Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force -ErrorAction SilentlyContinue
        Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "All servers stopped!" -ForegroundColor Green
    }
    "5" {
        Write-Host "🔄 Restarting everything..." -ForegroundColor Yellow
        
        # Stop everything
        Stop-ProcessOnPort -Port 3000
        Stop-ProcessOnPort -Port 5000
        Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force -ErrorAction SilentlyContinue
        Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
        
        Start-Sleep -Seconds 2
        
        # Start Next.js
        Write-Host "Starting Next.js..."
        $nextjsJob = Start-Job -ScriptBlock {
            Set-Location "f:\LIDM\20225\project LIDM\cirvia"
            npm run dev
        }
        
        Start-Sleep -Seconds 5
        
        # Start Flask
        Write-Host "Starting Flask CV Server..."
        Set-Location "f:\LIDM\20225\project LIDM\cirvia\src\app\practicum\cv-circuit"
        python web_cv_server.py
    }
    "6" {
        Write-Host "`n📊 Current Status:" -ForegroundColor Yellow
        $nextjsRunning = Test-Port -Port 3000 -ServiceName "Next.js"
        $flaskRunning = Test-Port -Port 5000 -ServiceName "Flask CV Server"
        
        if ($nextjsRunning -and $flaskRunning) {
            Write-Host "`n🎉 All systems operational!" -ForegroundColor Green
            Write-Host "🌐 Web Platform: http://localhost:3000" -ForegroundColor Cyan
            Write-Host "🤖 CV Direct: http://localhost:5000" -ForegroundColor Cyan  
            Write-Host "🎯 Practicum: http://localhost:3000/practicum" -ForegroundColor Cyan
        }
    }
    "7" {
        Write-Host "🔧 Quick fix - Stopping Python processes..." -ForegroundColor Yellow
        Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
        
        Write-Host "Starting Flask CV Server..."
        Set-Location "f:\LIDM\20225\project LIDM\cirvia\src\app\practicum\cv-circuit"
        python web_cv_server.py
    }
    "8" {
        Write-Host "🌐 Opening browsers..." -ForegroundColor Green
        Start-Process "http://localhost:3000"
        Start-Process "http://localhost:3000/practicum"
        Start-Process "http://localhost:5000"
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
    }
}
