#!/bin/bash
echo "Starting Story-to-Poem API server..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file from env.example..."
  cp env.example .env
fi

# Make sure the server is using the correct API key
export $(grep -v '^#' .env | xargs)

# Kill any existing server processes
echo "Stopping any running servers..."
pkill -f "node server.js" || true

# Run the server in the server directory
echo "Starting server from server directory..."
cd server && node server.js 