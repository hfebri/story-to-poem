#!/bin/bash
set -e

# Log the start of the build process
echo "Starting build process..."

# Install dependencies for the main project
echo "Installing main project dependencies..."
npm ci

# Build the frontend
echo "Building frontend..."
npm run build

# Check if the functions directory exists
if [ -d "netlify/functions" ]; then
  echo "Installing function dependencies..."
  cd netlify/functions
  npm ci
  cd ../..
fi

echo "Build completed successfully!" 