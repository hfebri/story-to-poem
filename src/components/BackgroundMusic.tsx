import { useState, useEffect, useRef } from "react";

const BackgroundMusic = () => {
  // The initial state comes from localStorage, default to unmuted if not set
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const savedState = localStorage.getItem("bgMusicMuted");
    return savedState ? JSON.parse(savedState) : false;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update localStorage when mute state changes
  useEffect(() => {
    localStorage.setItem("bgMusicMuted", JSON.stringify(isMuted));

    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0;
      } else {
        // Set to a comfortable background volume
        audioRef.current.volume = 0.3;

        // Try to play when unmuted
        const playPromise = audioRef.current.play();

        // Handle autoplay restrictions
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay prevented:", error);
            // We'll try again when there's user interaction
          });
        }
      }
    }
  }, [isMuted]);

  // Handle autoplay restrictions by trying to play on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch((err) => {
          console.log("Still couldn't play audio:", err);
        });
      }
      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prevMuted) => !prevMuted);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/music/bg-music.mp3" loop preload="auto" />

      {/* Mute/Unmute button */}
      <button
        onClick={toggleMute}
        className="bg-white bg-opacity-75 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#873053] border border-[#873053]"
        aria-label={
          isMuted ? "Unmute background music" : "Mute background music"
        }
      >
        {isMuted ? (
          // Muted icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#873053]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          // Unmuted icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#873053]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default BackgroundMusic;
