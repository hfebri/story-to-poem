import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./PoemDisplay.css";

type PoemDisplayProps = {
  poem: string | null;
  onBack: () => void;
  onRestart?: () => void;
  names?: { bride: string; groom: string };
};

const PoemDisplay = ({ poem, onBack, onRestart, names }: PoemDisplayProps) => {
  const [downloading, setDownloading] = useState(false);
  const poemRef = useRef<HTMLDivElement>(null);

  if (!poem) return null;

  const handleDownloadImage = async () => {
    if (!poemRef.current) return;

    try {
      setDownloading(true);

      // Create canvas from the poem container
      const poemCanvas = await html2canvas(poemRef.current, {
        useCORS: true,
        allowTaint: false,
      });

      // Create a new canvas for the final composition
      const finalCanvas = document.createElement("canvas");
      const ctx = finalCanvas.getContext("2d");

      if (!ctx) throw new Error("Could not get canvas context");

      // Load the background image
      const backgroundImg = new Image();
      backgroundImg.crossOrigin = "anonymous";

      backgroundImg.onload = () => {
        // Set canvas size to background image size
        finalCanvas.width = backgroundImg.width;
        finalCanvas.height = backgroundImg.height;

        // Draw background
        ctx.drawImage(backgroundImg, 0, 0);

        // Calculate position to center the poem content
        const poemX = (backgroundImg.width - poemCanvas.width) / 2;
        const poemY = (backgroundImg.height - poemCanvas.height) / 2;

        // Draw poem content on top
        ctx.drawImage(poemCanvas, poemX, poemY);

        // Convert final canvas to blob and download
        finalCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            // Generate filename with names if available
            const filename =
              names && (names.bride || names.groom)
                ? `poem-${names.bride.replace(
                    /\s+/g,
                    "-"
                  )}-${names.groom.replace(/\s+/g, "-")}.png`
                : "wedding-poem.png";

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
          setDownloading(false);
        }, "image/png");
      };

      backgroundImg.onerror = () => {
        console.error("Failed to load background image");
        // Fallback to original method without background
        poemCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const filename =
              names && (names.bride || names.groom)
                ? `poem-${names.bride.replace(
                    /\s+/g,
                    "-"
                  )}-${names.groom.replace(/\s+/g, "-")}.png`
                : "wedding-poem.png";
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
          setDownloading(false);
        }, "image/png");
      };

      // Load the background image
      backgroundImg.src = "/backgrounds/background.png";
    } catch (err) {
      console.error("Failed to download image: ", err);
      alert("Failed to download image");
      setDownloading(false);
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

      <div
        className="bg-white bg-opacity-75 border-2 border-[#ECDFE4] rounded-[28px] p-8 mb-6 shadow-lg poem-container"
        ref={poemRef}
        style={{
          padding: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {names && (names.bride || names.groom) && (
          <div className="mb-4 text-center">
            <h2
              className="text-base font-medium text-[#873053]"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              For {names.bride} & {names.groom}
            </h2>
            <div className="w-16 h-0.5 bg-[#ECDFE4] mx-auto mt-3 mb-6 rounded-full"></div>
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
          onClick={handleDownloadImage}
          className="px-3 py-2 bg-white border border-[#873053] text-[#873053] rounded-full text-sm font-medium flex items-center transition-colors cursor-pointer shadow-md hover:bg-[#f8f0f3]"
          type="button"
          aria-label="Download poem as image"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {downloading ? "Downloading..." : "Download"}
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
