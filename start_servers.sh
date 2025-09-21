#!/bin/bash

# Start both Django and Next.js servers for development

echo "🚀 Starting Affordable Housing Project Development Servers..."

# Function to clean up background processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    jobs -p | xargs -r kill
    exit
}

# Set up cleanup on script exit
trap cleanup EXIT INT TERM

# Start Django server in background
echo "📡 Starting Django server on http://localhost:8000..."
source venv/bin/activate && python3 manage.py runserver &
DJANGO_PID=$!

# Wait a bit for Django to start
sleep 3

# Start Next.js server in background
echo "⚡ Starting Next.js server on http://localhost:3000..."
cd frontend && npm run dev &
NEXTJS_PID=$!

echo ""
echo "🎉 Both servers are starting up!"
echo "📡 Django API: http://localhost:8000/api/houses/"
echo "⚡ Next.js App: http://localhost:3000"
echo "📝 Add House Form: http://localhost:3000/add-house"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for background processes
wait $DJANGO_PID $NEXTJS_PID
