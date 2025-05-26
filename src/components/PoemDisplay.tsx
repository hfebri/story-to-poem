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

      // Load the background image first
      const backgroundImg = new Image();
      backgroundImg.crossOrigin = "anonymous";

      const loadBackgroundImage = () => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          backgroundImg.onload = () => {
            console.log(
              "Background image loaded successfully",
              backgroundImg.width,
              backgroundImg.height
            );
            resolve(backgroundImg);
          };
          backgroundImg.onerror = (error) => {
            console.error("Failed to load background image:", error);
            reject(error);
          };
          backgroundImg.src = "/backgrounds/page-background.png";
        });
      };

      // Load background image
      const bgImage = await loadBackgroundImage();

      // Create canvas from the poem container content only (without border styling)
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = poemRef.current.innerHTML;
      tempDiv.style.fontFamily = "Georgia, serif";
      tempDiv.style.color = "#333";
      tempDiv.style.padding = "60px";
      tempDiv.style.textAlign = "center";
      tempDiv.style.backgroundColor = "transparent";
      tempDiv.style.width = "600px"; // Larger size for better text quality
      tempDiv.style.minHeight = "400px";
      tempDiv.style.display = "flex";
      tempDiv.style.flexDirection = "column";
      tempDiv.style.justifyContent = "center";
      tempDiv.style.fontSize = "24px"; // Larger font size
      tempDiv.style.lineHeight = "1.6";

      // Fix divider line styling in the temporary div
      const dividerElements = tempDiv.querySelectorAll("div");
      dividerElements.forEach((el) => {
        if (
          el.classList.contains("w-12") ||
          el.style.width ||
          el.style.height
        ) {
          el.style.width = "60px";
          el.style.height = "2px";
          el.style.backgroundColor = "#ECDFE4";
          el.style.margin = "16px auto 24px auto";
        }
      });

      // Style the "For" text specifically
      const forText = tempDiv.querySelector("h2");
      if (forText) {
        forText.style.fontSize = "28px";
        forText.style.fontWeight = "500";
        forText.style.color = "#873053";
        forText.style.marginBottom = "16px";
        forText.style.fontFamily = "Cinzel, serif";
      }

      document.body.appendChild(tempDiv);

      const contentCanvas = await html2canvas(tempDiv, {
        useCORS: true,
        allowTaint: false,
      });

      document.body.removeChild(tempDiv);

      console.log(
        "Content canvas created:",
        contentCanvas.width,
        contentCanvas.height
      );

      // Function to draw rounded rectangle
      const drawRoundedRect = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
      ) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height
        );
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };

      // Create a new canvas for the final composition
      const finalCanvas = document.createElement("canvas");
      const ctx = finalCanvas.getContext("2d");

      if (!ctx) throw new Error("Could not get canvas context");

      // Set canvas size to background image size
      finalCanvas.width = bgImage.width;
      finalCanvas.height = bgImage.height;

      console.log("Final canvas size:", finalCanvas.width, finalCanvas.height);

      // Draw background
      ctx.drawImage(bgImage, 0, 0);

      // Calculate poem container dimensions and position
      const containerWidth = Math.min(600, bgImage.width - 60); // Larger container
      const containerHeight = Math.min(500, bgImage.height - 100);
      const containerX = (bgImage.width - containerWidth) / 2;
      const containerY = (bgImage.height - containerHeight) / 2;

      // Draw rounded rectangle background
      ctx.save();
      drawRoundedRect(
        ctx,
        containerX,
        containerY,
        containerWidth,
        containerHeight,
        28
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fill();

      // Draw border
      ctx.strokeStyle = "#ECDFE4";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Calculate content position within the rounded container
      const contentScale = Math.min(
        (containerWidth - 40) / contentCanvas.width, // Less padding for more space
        (containerHeight - 40) / contentCanvas.height,
        0.8 // Max scale to ensure readability
      );

      const scaledContentWidth = contentCanvas.width * contentScale;
      const scaledContentHeight = contentCanvas.height * contentScale;
      const contentX = containerX + (containerWidth - scaledContentWidth) / 2;
      const contentY = containerY + (containerHeight - scaledContentHeight) / 2;

      console.log(
        "Content position:",
        contentX,
        contentY,
        "Scale:",
        contentScale
      );

      // Draw content on top
      ctx.drawImage(
        contentCanvas,
        contentX,
        contentY,
        scaledContentWidth,
        scaledContentHeight
      );

      // Convert final canvas to blob and download
      finalCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;

          // Generate filename with names if available
          const filename =
            names && (names.bride || names.groom)
              ? `poem-${names.bride.replace(/\s+/g, "-")}-${names.groom.replace(
                  /\s+/g,
                  "-"
                )}.png`
              : "wedding-poem.png";

          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log("Download completed successfully");
        }
      }, "image/png");
    } catch (err) {
      console.error("Failed to download image: ", err);

      // Fallback: download poem without background
      try {
        const poemCanvas = await html2canvas(poemRef.current, {
          useCORS: true,
          allowTaint: false,
        });

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
        }, "image/png");
      } catch (fallbackErr) {
        console.error("Fallback download also failed:", fallbackErr);
        alert("Failed to download image");
      }
    } finally {
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
          margin: "20px",
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
            <div className="w-12 h-px bg-[#ECDFE4] mx-auto mt-2 mb-5"></div>
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
