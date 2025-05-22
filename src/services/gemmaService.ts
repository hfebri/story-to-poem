import axios from "axios";

// Gemma API service for transforming stories to poems
export default class GemmaService {
  // Dynamic API URL that works both in development and production
  private proxyUrl: string = import.meta.env.PROD
    ? "/api/generate-poem"
    : "http://localhost:3000/api/generate-poem";

  // We just need to validate that an API key was provided, but don't use it directly
  constructor() {
    // API key is handled by the server
  }

  /**
   * Transform a user story into a poem using Gemma API through our proxy
   * @param story - The user's story text
   * @param names - Optional object containing bride and groom names
   * @returns The generated poem
   */
  async storyToPoem(
    story: string,
    names?: { bride: string; groom: string }
  ): Promise<string> {
    try {
      // Create name information if provided
      let nameInfo = "";
      if (names && (names.bride || names.groom)) {
        nameInfo = `\nNames: ${names.bride || "Bride"} and ${
          names.groom || "Groom"
        }\n`;
      }

      const prompt = `
        Transform the following personal promise into an exquisite poem. Let the words reflect quiet elegance, emotional depth, and the enduring nature of love and commitment.
        
        DO NOT include any introductory text like "Here's a poem" or explanatory notes. ONLY include the poem itself.${nameInfo}

        Promise: ${story}

        Guidelines:

        - Embrace a tone of grace and sincerity, with a refined poetic voice.
        - Convey the emotional weight and intimacy behind the promise.
        - Let each line shine with clarity and care—like something everlasting.
        - The result should feel timeless, delicate, and deeply meaningful.
        - Embody the luxury and refinement synonymous.
        - Ensure the poem exudes elegance, emotional depth.
        ${
          names
            ? `- Personalize the poem for ${names.bride} and ${names.groom} by incorporating their names naturally within the poem.`
            : ""
        }
      `;

      const response = await axios.post(this.proxyUrl, { prompt });

      // Extract text from the response based on the structure returned by the API
      let poemText = "";
      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts
      ) {
        poemText = response.data.candidates[0].content.parts[0].text;
      } else {
        // Fallback in case the response structure is different
        poemText = response.data?.text || "Could not parse poem from response";
      }

      // Clean up the poem text to remove common AI introductions and explanations
      return this.cleanPoemText(poemText);
    } catch (error) {
      console.error("Error generating poem:", error);
      throw new Error("Failed to generate poem. Please try again later.");
    }
  }

  /**
   * Clean up the poem text to remove AI introductions and explanations
   * @param text - The raw text from the AI
   * @returns Cleaned poem text
   */
  private cleanPoemText(text: string): string {
    // Remove common introductory phrases
    const introPatterns = [
      /^(Here's|Here is|I've created|I have created|Certainly|Of course|Okay|Sure|Below is|This is) .+?(?=\n\n)/is,
      /^.+?(poem|sonnet|haiku|verse|piece).+?(?=\n\n)/is,
      /^.+?(crafted|wrote|composed|created|present|offer).+?(?=\n\n)/is,
      /^.+?(requested|based on|inspired by|following your).+?(?=\n\n)/is,
      /^\*\*.+?\*\*\s*\n+/gm, // Remove markdown headers like **Title**
      /^#.+?\n+/gm, // Remove markdown headers like # Title
    ];

    // Remove closing explanations and notes
    const outroPatterns = [
      /\n\n.+?(hope|trust|believe).+?$/is,
      /\n\n.+?(captures|embodies|reflects).+?$/is,
      /\n\n.+?(note|explanation|thoughts|ideas|variations|options).+?$/is,
      /\n\n\*\*.+?\*\*.*$/is, // Remove sections that start with **Note** or similar
      /\n\n---.*$/s, // Remove everything after a markdown divider
    ];

    let cleanedText = text.trim();

    // Apply intro patterns
    for (const pattern of introPatterns) {
      cleanedText = cleanedText.replace(pattern, "");
    }

    // Apply outro patterns
    for (const pattern of outroPatterns) {
      cleanedText = cleanedText.replace(pattern, "");
    }

    // Handle case where the entire text is wrapped in quotes
    if (cleanedText.startsWith('"') && cleanedText.endsWith('"')) {
      cleanedText = cleanedText.substring(1, cleanedText.length - 1);
    }

    return cleanedText.trim();
  }
}
