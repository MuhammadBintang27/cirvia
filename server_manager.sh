#!/bin/bash
# Server Management Script for Cirvia + CV

echo "🚀 Cirvia + CV Server Management"
echo "=================================="

# Function to check if port is in use
check_port() {
    local port=$1
    local service=$2
    if netstat -ano | findstr :$port > /dev/null 2>&1; then
        echo "✅ $service is running on port $port"
        return 0
    else
        echo "❌ $service is not running on port $port"
        return 1
    fi
}

# Function to kill processes on port
kill_port() {
    local port=$1
    local pids=$(netstat -ano | findstr :$port | awk '{print $5}' | sort -u)
    for pid in $pids; do
        if [ "$pid" != "" ] && [ "$pid" != "0" ]; then
            echo "🔪 Killing process $pid on port $port"
            taskkill /PID $pid /F 2>/dev/null
        fi
    done
}

# Check current status
echo "📊 Current Status:"
check_port 3000 "Next.js"
check_port 5000 "Flask CV Server"

echo ""
echo "🎯 Available Commands:"
echo "1. Start Next.js only"
echo "2. Start Flask CV only" 
echo "3. Start both servers"
echo "4. Stop all servers"
echo "5. Restart everything"
echo "6. Show status"

read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo "🌐 Starting Next.js..."
        cd "f:\LIDM\20225\project LIDM\cirvia"
        npm run dev
        ;;
    2)
        echo "🤖 Starting Flask CV Server..."
        cd "f:\LIDM\20225\project LIDM\cirvia\src\app\practicum\cv-circuit"
        python web_cv_server.py
        ;;
    3)
        echo "🚀 Starting both servers..."
        echo "Starting Next.js in background..."
        cd "f:\LIDM\20225\project LIDM\cirvia"
        start /B npm run dev
        
        sleep 5
        
        echo "Starting Flask CV Server..."
        cd "f:\LIDM\20225\project LIDM\cirvia\src\app\practicum\cv-circuit"
        python web_cv_server.py
        ;;
    4)
        echo "🛑 Stopping all servers..."
        kill_port 3000
        kill_port 5000
        echo "All servers stopped!"
        ;;
    5)
        echo "🔄 Restarting everything..."
        kill_port 3000
        kill_port 5000
        sleep 2
        
        echo "Starting Next.js..."
        cd "f:\LIDM\20225\project LIDM\cirvia"
        start /B npm run dev
        
        sleep 5
        
        echo "Starting Flask CV Server..."
        cd "f:\LIDM\20225\project LIDM\cirvia\src\app\practicum\cv-circuit"
        python web_cv_server.py
        ;;
    6)
        echo "📊 Current Status:"
        check_port 3000 "Next.js"
        check_port 5000 "Flask CV Server"
        
        if check_port 3000 && check_port 5000; then
            echo ""
            echo "🎉 All systems operational!"
            echo "🌐 Web Platform: http://localhost:3000"
            echo "🤖 CV Direct: http://localhost:5000"  
            echo "🎯 Practicum: http://localhost:3000/practicum"
        fi
        ;;
    *)
        echo "❌ Invalid choice"
        ;;
esac
