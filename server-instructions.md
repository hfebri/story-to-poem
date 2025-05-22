# Server Setup Instructions

Follow these steps to set up and run the proxy server:

## 1. Install Server Dependencies

```bash
# Copy the server-package.json to package.json in the server directory
cp server-package.json server/package.json

# Create a server directory
mkdir -p server

# Move server.js to the server directory
mv server.js server/

# Navigate to the server directory
cd server

# Install dependencies
npm install
```

## 2. Configure API Key

Create a `.env` file in the server directory:

```bash
# Create .env file
echo "VITE_GEMMA_API_KEY=your_gemma_api_key_here" > .env
```

Replace `your_gemma_api_key_here` with your actual Gemma API key.

## 3. Start the Server

```bash
# Start the server
npm start

# Or for development with auto-restart
npm run dev
```

The server will run on http://localhost:3000.

## 4. Test the Server

You can test the server is running correctly by accessing:

```
http://localhost:3000/health
```

It should return: `{"status":"ok"}`

## Troubleshooting

- If you get a "port in use" error, modify the port number in `server.js`
- If you get API errors, make sure your Gemma API key is correct and has access to the model
- Check server logs for detailed error information
