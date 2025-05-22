const axios = require("axios");

// List of models to try in order of preference
const API_MODELS = ["models/gemma-3-27b-it", "models/gemma-3-12b-it"];

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.VITE_GEMMA_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "API key is not configured" }),
      };
    }

    // Try each model in sequence
    let lastError = null;
    for (const model of API_MODELS) {
      try {
        console.log(`Trying model: ${model}`);
        // Remove the "models/" prefix for the URL construction
        const modelNameForUrl = model.replace("models/", "");
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelNameForUrl}:generateContent`;

        const response = await axios.post(
          apiUrl,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
          }
        );

        return {
          statusCode: 200,
          body: JSON.stringify(response.data),
        };
      } catch (modelError) {
        console.error(`Error with model ${model}:`, modelError.message);
        if (modelError.response) {
          console.error("Response status:", modelError.response.status);
          console.error(
            "Response data:",
            JSON.stringify(modelError.response.data, null, 2)
          );
        }
        lastError = modelError;
      }
    }

    // If we get here, all models failed
    throw lastError || new Error("All models failed with unknown errors");
  } catch (error) {
    console.error(
      "Error calling Gemma API:",
      error.response?.data || error.message
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to generate poem",
        details: error.response?.data || error.message,
      }),
    };
  }
};
