// Environment configuration
export const config = {
  // Get the Gemma API key from environment variables
  gemmaApiKey: import.meta.env.VITE_GEMMA_API_KEY || "",
};

// Instructions for users to set up the API key
export const apiKeyInstructions = `
  To use this application, you need to obtain a Gemma 3 API key:
  1. Visit https://ai.google.dev/ and sign up for API access
  2. Request access to the Gemma 3 model (google/gemma-3-27b-it)
  3. Create a .env file in the project root directory
  4. Add the following line to the .env file:
     VITE_GEMMA_API_KEY=your_gemma_api_key_here
  5. Restart the application
`;
