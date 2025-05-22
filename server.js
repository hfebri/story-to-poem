import express from "express";
import cors from "cors";
import axios from "axios";
import { config } from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Initialize dotenv
config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// List of models to try in order of preference
const API_MODELS = ["models/gemma-3-27b-it", "models/gemma-3-12b-it"];

// Proxy endpoint for Gemma API
app.post("/api/generate-poem", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.VITE_GEMMA_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: "API key is not configured" });
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
    console.error(
      "Error calling Gemma API:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to generate poem",
      details: error.response?.data || error.message,
    });
  }
});

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
