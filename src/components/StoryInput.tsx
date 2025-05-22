import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type StoryInputProps = {
  onSubmit: (story: string) => void;
  onBack: () => void;
  isLoading: boolean;
  role?: "Bride" | "Groom" | null;
  names?: { bride: string; groom: string };
};

const StoryInput = ({ onSubmit, isLoading }: StoryInputProps) => {
  const [story, setStory] = useState<string>("");

  const handleStoryChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (story.trim()) {
      onSubmit(story);
    }
  };

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
          What is the promise you want to live by every day?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white bg-opacity-55 border-2 border-[#ECDFE4] rounded-[28px] p-4 shadow-lg">
          <textarea
            id="story"
            value={story}
            onChange={handleStoryChange}
            placeholder="I promise to be grateful for every moment we share."
            required
            rows={6}
            className="w-full p-2 border-none bg-transparent focus:outline-none focus:ring-0 text-base text-black"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !story.trim()}
            className={`px-5 py-2.5 text-white font-bold rounded-full text-center shadow-md ${
              isLoading || !story.trim()
                ? "bg-[#873053] opacity-70 cursor-not-allowed"
                : "bg-[#873053] hover:bg-[#973063] focus:outline-none"
            }`}
            style={{ fontFamily: "Cinzel, serif" }}
          >
            {isLoading ? "Generating..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoryInput;
