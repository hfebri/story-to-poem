import { useState, useEffect, useRef } from "react";

const BackgroundMusic = () => {
  // The initial state comes from localStorage, default to unmuted if not set
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const savedState = localStorage.getItem("bgMusicMuted");
    return savedState ? JSON.parse(savedState) : false;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState<boolean>(() => {
    // Only need interaction if not muted
    const savedState = localStorage.getItem("bgMusicMuted");
    const isMutedOnLoad = savedState ? JSON.parse(savedState) : false;
    return !isMutedOnLoad;
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasTriedRef = useRef(false);

  // Try to play audio
  const tryToPlay = async () => {
    if (!audioRef.current || isMuted) return;

    try {
      audioRef.current.volume = 0.3;
      await audioRef.current.play();
      setIsPlaying(true);
      setNeedsInteraction(false);
      console.log("Audio started successfully");
    } catch (error) {
      console.log("Audio play prevented:", error);
      setIsPlaying(false);
      setNeedsInteraction(true);
    }
  };

  // Initialize audio when component mounts
  useEffect(() => {
    if (audioRef.current && !hasTriedRef.current) {
      hasTriedRef.current = true;
      // Try to play immediately (usually fails but worth trying)
      tryToPlay();
    }
  }, []);

  // Handle mute state changes
  useEffect(() => {
    localStorage.setItem("bgMusicMuted", JSON.stringify(isMuted));

    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      // Don't automatically try to play when unmuting - wait for user interaction
    }
  }, [isMuted]);

  // Set up user interaction listeners
  useEffect(() => {
    if (!needsInteraction || isMuted) return;

    const handleInteraction = () => {
      tryToPlay();
    };

    // Listen for any user interaction
    const events = ["click", "touchstart", "keydown", "mousedown"];

    events.forEach((event) => {
      document.addEventListener(event, handleInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [needsInteraction, isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMutedState = !prev;
      // If unmuting, we need to check if interaction is required
      if (!newMutedState) {
        setNeedsInteraction(true);
      }
      return newMutedState;
    });
  };

  return (
    <>
      {/* Audio element */}
      <audio ref={audioRef} src="/music/bg-music.mp3" loop preload="auto" />

      {/* Full screen overlay and interaction prompt */}
      {needsInteraction && !isMuted && (
        <>
          {/* Subtle overlay */}
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>

          {/* Original modal design */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white bg-opacity-95 p-6 rounded-lg shadow-xl text-center border border-[#873053]">
            <div className="mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#873053] mx-auto"
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
            </div>
            <p className="text-[#873053] text-sm mb-4">
              Click anywhere to enable background music
            </p>
            <button
              onClick={tryToPlay}
              className="bg-[#873053] text-white px-4 py-2 rounded-full text-sm hover:bg-[#6e2743] transition-colors"
            >
              Enable Music
            </button>
          </div>
        </>
      )}

      {/* Mute/Unmute button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={toggleMute}
          className={`bg-white p-2 rounded-full shadow-lg transition-all duration-300 
                    focus:outline-none focus:ring-2 focus:ring-[#873053] border border-[#873053]
                    ${
                      isMuted
                        ? "bg-opacity-75 hover:bg-opacity-100"
                        : "bg-opacity-90 hover:bg-opacity-100"
                    }
                    ${isPlaying && !isMuted ? "animate-pulse" : ""}`}
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
    </>
  );
};

export default BackgroundMusic;
