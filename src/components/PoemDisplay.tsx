import { useState } from "react";
import "./PoemDisplay.css";

type PoemDisplayProps = {
  poem: string | null;
  onBack: () => void;
  onRestart?: () => void;
  names?: { bride: string; groom: string };
};

const PoemDisplay = ({ poem, onBack, onRestart, names }: PoemDisplayProps) => {
  const [copied, setCopied] = useState(false);

  if (!poem) return null;

  const handleCopy = async () => {
    if (!poem) return;

    try {
      await navigator.clipboard.writeText(poem);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy to clipboard");
    }
  };

  const handleStartAgain = () => {
    // Use onRestart if provided, otherwise fall back to onBack
    if (onRestart) {
      onRestart();
    } else {
      onBack();
    }
  };

  // Pre-process the poem to ensure proper formatting
  const formattedPoem = poem
    // Replace explicit newline characters with actual line breaks
    .replace(/\\n/g, "\n")
    // Ensure consistent line breaks
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1
          className="text-xl sm:text-2xl font-normal mb-2 tracking-tight text-black"
          style={{
            fontFamily: "Cinzel, serif",
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          A real promise is kept in quiet moments, not just wedding vows.
        </h1>
        <p
          className="text-sm sm:text-base leading-relaxed text-black"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
        >
          What is the promise you want to live by — every day?
        </p>
      </div>

      <div className="bg-white bg-opacity-75 border-2 border-[#ECDFE4] rounded-[28px] p-6 mb-6 shadow-lg poem-container">
        {names && (names.bride || names.groom) && (
          <div className="mb-4 text-center">
            <h2
              className="text-base font-medium text-[#873053]"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              For {names.bride} & {names.groom}
            </h2>
            <div className="w-24 h-1 bg-[#ECDFE4] mx-auto mt-2 mb-4 rounded-full"></div>
          </div>
        )}

        <div className="text-black leading-relaxed poem-content">
          {/* Using custom formatting with line breaks */}
          <div className="poem-lines-container">
            {formattedPoem.split("\n").map((line, index) => (
              <div
                key={index}
                className={`poem-line ${
                  !line.trim() ? "poem-stanza-break" : ""
                }`}
              >
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleCopy}
          className="px-3 py-2 bg-white border border-[#873053] text-[#873053] rounded-full text-sm font-medium flex items-center transition-colors cursor-pointer shadow-md hover:bg-[#f8f0f3]"
          type="button"
          aria-label="Copy poem to clipboard"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          {copied ? "Copied!" : "Copy"}
        </button>

        <button
          onClick={handleStartAgain}
          className="px-3 py-2 bg-[#873053] text-white rounded-full text-sm font-medium flex items-center transition-colors cursor-pointer shadow-md hover:bg-[#6e2743]"
          type="button"
          aria-label="Start again"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Start Again
        </button>
      </div>
    </div>
  );
};

export default PoemDisplay;
