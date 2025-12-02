#!/bin/bash

# CRUD Server control script
# Uses nohup to run in background

PID_FILE="crud-server.pid"
LOG_FILE="crud-server.log"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

start_server() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            echo -e "${YELLOW}Server is already running (PID: $PID)${NC}"
            exit 1
        fi
    fi
    
    echo -e "${BLUE}Building and starting server...${NC}"
    npm run build
    
    # Start server in background with memory optimization
    nohup node \
        --max-old-space-size=128 \
        --optimize-for-size \
        --gc-interval=100 \
        --no-warnings \
        dist/index.js > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    
    echo -e "${GREEN}✓ Server started (PID: $!)${NC}"
    echo -e "${YELLOW}Logs: tail -f $LOG_FILE${NC}"
}

stop_server() {
    if [ ! -f "$PID_FILE" ]; then
        echo -e "${RED}No PID file found. Server may not be running.${NC}"
        exit 1
    fi
    
    PID=$(cat "$PID_FILE")
    
    if ps -p "$PID" > /dev/null 2>&1; then
        echo -e "${BLUE}Stopping server (PID: $PID)...${NC}"
        kill "$PID"
        rm "$PID_FILE"
        echo -e "${GREEN}✓ Server stopped${NC}"
    else
        echo -e "${RED}Server is not running${NC}"
        rm "$PID_FILE"
    fi
}

restart_server() {
    echo -e "${BLUE}Restarting server...${NC}"
    stop_server
    sleep 2
    start_server
}

status_server() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Server is running (PID: $PID)${NC}"
            echo -e "Memory: $(ps -o rss= -p "$PID" | awk '{printf "%.2f MB", $1/1024}')"
            echo -e "CPU: $(ps -o %cpu= -p "$PID")%"
        else
            echo -e "${RED}✗ Server is not running (stale PID file)${NC}"
            rm "$PID_FILE"
        fi
    else
        echo -e "${RED}✗ Server is not running${NC}"
    fi
}

logs_server() {
    if [ ! -f "$LOG_FILE" ]; then
        echo -e "${RED}No log file found${NC}"
        exit 1
    fi
    tail -f "$LOG_FILE"
}

case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        status_server
        ;;
    logs)
        logs_server
        ;;
    *)
        echo -e "${YELLOW}CRUD Server Control Script${NC}"
        echo ""
        echo "Usage: ./crud-server.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start    - Build and start the server in background"
        echo "  stop     - Stop the server"
        echo "  restart  - Rebuild and restart the server"
        echo "  status   - Show server status"
        echo "  logs     - Show server logs (Ctrl+C to exit)"
        echo ""
        echo "Examples:"
        echo "  ./crud-server.sh start"
        echo "  ./crud-server.sh logs"
        exit 1
        ;;
esac

