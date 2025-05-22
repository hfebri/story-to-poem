const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

// Log environment information
console.log("Current working directory:", process.cwd());
console.log("Looking for .env at path:", path.resolve("../env.example"));
console.log(
  "env.example exists:",
  fs.existsSync(path.resolve("../env.example"))
);
console.log("Looking for .env at path:", path.resolve("../.env"));
console.log(".env exists:", fs.existsSync(path.resolve("../.env")));

// Try reading the .env file directly to see its contents
try {
  if (fs.existsSync(path.resolve("../.env"))) {
    const envContent = fs.readFileSync(path.resolve("../.env"), "utf8");
    console.log(
      ".env file content (first few chars):",
      envContent.substring(0, 50) + "..."
    );
  }
} catch (error) {
  console.error("Error reading .env file:", error.message);
}

// Load environment variables
require("dotenv").config({ path: path.resolve("../.env") });

// Log all available environment variables (safely)
console.log("Environment variables:");
Object.keys(process.env).forEach((key) => {
  if (
    key.includes("API_KEY") ||
    key.includes("KEY") ||
    key.includes("SECRET")
  ) {
    console.log(
      `${key}: ${process.env[key].substring(0, 3)}...${process.env[
        key
      ].substring(process.env[key].length - 3)}`
    );
  } else if (key.startsWith("VITE_")) {
    console.log(`${key}: ${process.env[key]}`);
  }
});

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// List of models to try in order of preference - MUST include "models/" prefix
const API_MODELS = ["models/gemma-3-27b-it", "models/gemma-3-12b-it"];

// Add a route to list available models
app.get("/api/list-models", async (req, res) => {
  try {
    const apiKey = process.env.VITE_GEMMA_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "API key is not configured" });
    }

    const response = await axios.get(
      "https://generativelanguage.googleapis.com/v1beta/models",
      {
        headers: {
          "x-goog-api-key": apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error listing models:", error.message);
    res.status(500).json({
      error: "Failed to list models",
      details: error.message,
      response: error.response?.data || "No response data available",
    });
  }
});

// Proxy endpoint for Gemma API
app.post("/api/generate-poem", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.VITE_GEMMA_API_KEY;

    if (!apiKey) {
      console.error("API key is not configured");
      return res.status(400).json({ error: "API key is not configured" });
    }

    console.log(
      "Using API Key:",
      apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 4)
    );
    console.log("Sending prompt:", prompt.substring(0, 50) + "...");

    // Try each model in sequence
    let lastError = null;
    for (const model of API_MODELS) {
      try {
        console.log(`Trying model: ${model}`);
        // Remove the "models/" prefix for the URL construction
        const modelNameForUrl = model.replace("models/", "");
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelNameForUrl}:generateContent`;
        console.log(`API URL: ${apiUrl}`);

        const response = await axios.post(
          apiUrl,
          {
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            systemInstruction: {
              parts: [
                {
                  text: "You are a professional poet. When given a prompt to create a poem, respond ONLY with the poem itself. Do not include any introductions, explanations, or closing remarks. Do not start with phrases like 'Here's a poem' or 'I hope you enjoy this'. Do not include titles unless specifically requested. Just output the poem directly.",
                },
              ],
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            timeout: 10000, // 10 second timeout
          }
        );

        console.log("Response received. Status:", response.status);
        console.log(
          "Response shape:",
          JSON.stringify(Object.keys(response.data))
        );

        // Adapt the response structure for the client
        // Check if the response has candidates array as expected
        if (response.data.candidates && response.data.candidates.length > 0) {
          const candidate = response.data.candidates[0];
          if (
            candidate.content &&
            candidate.content.parts &&
            candidate.content.parts.length > 0
          ) {
            const poemText = candidate.content.parts[0].text;
            console.log(
              "Generated poem (first 50 chars):",
              poemText.substring(0, 50) + "..."
            );
            return res.json(response.data);
          }
        }

        // If we can't find the expected structure, return the raw response
        return res.json(response.data);
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
    console.error("Error calling API:", error.message);
    res.status(500).json({
      error: "Failed to generate poem",
      details: error.message,
      response: error.response?.data || "No response data available",
    });
  }
});

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
  console.log(`API Key available: ${!!process.env.VITE_GEMMA_API_KEY}`);
});
