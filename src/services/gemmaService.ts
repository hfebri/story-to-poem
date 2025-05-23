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
      // Build the prompt based on whether names are provided
      let personalizationContext = "";
      if (names && (names.bride || names.groom)) {
        personalizationContext = `This is for ${names.bride || "a bride"} and ${
          names.groom || "a groom"
        }. `;
      }

      const prompt = `
        Transform the following personal promise into a graceful haiku.
        Let the poem reflect quiet elegance, emotional depth, and a sense of timeless commitment.
        ${personalizationContext}
        Promise: ${story}

        Format:
        - Haiku
        - 3 lines
        - 5-7-5 syllables
        - No titles, no explanations, no follow-up.
        - No introduction. No explanation. No outro. Only the haiku.

        Guidelines: 
        - The poem should be a single haiku, not a list of haikus.
        - Only output the haiku—no titles, no explanations, no follow-up.
        - Follow the traditional haiku structure: 3 lines with 5-7-5 syllables.
        - Evoke a sense of stillness, sincerity, and permanence—like a promise set in stone.
        - Keep the tone delicate, refined, and emotionally evocative.
        - Let each word carry the weight of love, memory, and beauty.
        - The poem should be in the style of a traditional haiku, not a modern poem.
        - No introduction. No explanation. No outro. Only the haiku.`;

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
