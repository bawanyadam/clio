#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting clio setup and launch...${NC}"

# 1. Check for conversations.json
if [ ! -f "conversations.json" ]; then
    echo -e "${GREEN}Warning: 'conversations.json' not found in root directory.${NC}"
    echo "Please add your data file to see results in the UI."
fi

# 2. Setup Python Backend
echo -e "${BLUE}Setting up Python backend...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt > /dev/null

# 3. Setup Frontend
echo -e "${BLUE}Setting up frontend...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    npm install > /dev/null
fi
cd ..

# 4. Start Backend API in background
echo -e "${BLUE}Starting API server...${NC}"
./venv/bin/python3 -m uvicorn api:app --port 8000 > /dev/null 2>&1 &
API_PID=$!

# 5. Start Frontend in background
echo -e "${BLUE}Starting frontend server...${NC}"
cd frontend
npm run dev > /dev/null 2>&1 &
FE_PID=$!
cd ..

# 6. Open Browser
echo -e "${GREEN}clio is launching!${NC}"
echo "API running on http://localhost:8000"
echo "Frontend running on http://localhost:3000"

# Wait a few seconds for servers to initialize before opening
sleep 5

if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000
else
    echo "Please open http://localhost:3000 in your browser."
fi

# Trap to kill background processes on exit
trap "kill $API_PID $FE_PID; exit" INT TERM
echo -e "${BLUE}Press Ctrl+C to stop the servers.${NC}"

# Keep script running to maintain background processes
wait
