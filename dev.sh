#!/bin/bash
echo "Setting up Story-to-Poem development environment..."

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file from template..."
  cp env-example.txt .env
  echo "Please edit the .env file and add your Gemma API key before running this script again."
  exit 1
fi

# Check if concurrently is installed
if ! npm list --depth=0 | grep -q concurrently; then
  echo "Installing concurrently package..."
  npm install --save-dev concurrently
fi

# Start both servers
echo "Starting development servers..."
npm run dev:all 