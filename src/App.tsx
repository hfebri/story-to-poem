import { useState, useEffect } from "react";
import StoryInput from "./components/StoryInput";
import PoemDisplay from "./components/PoemDisplay";
import LoadingSpinner from "./components/LoadingSpinner";
import BrideGroomSelect from "./components/BrideGroomSelect";
import NavigationProgress from "./components/NavigationProgress";
import NameInputForm from "./components/NameInputForm";
import BackArrow from "./components/BackArrow";
import BackgroundMusic from "./components/BackgroundMusic";
import GemmaService from "./services/gemmaService";
import { config, apiKeyInstructions } from "./config";

function App() {
  const [gemmaService, setGemmaService] = useState<GemmaService | null>(null);
  const [poem, setPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"Bride" | "Groom" | null>(null);
  const [step, setStep] = useState<"selection" | "names" | "promise" | "poem">(
    "selection"
  );
  const [names, setNames] = useState<{ bride: string; groom: string }>({
    bride: "",
    groom: "",
  });
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Convert current step to number for navigation progress
  const getCurrentStepNumber = () => {
    switch (step) {
      case "selection":
        return 1;
      case "names":
        return 2;
      case "promise":
        return 3;
      case "poem":
        return 4;
      default:
        return 1;
    }
  };

  // Initialize Gemma service when component mounts
  useEffect(() => {
    if (config.gemmaApiKey) {
      try {
        setGemmaService(new GemmaService());
        setError(null);
      } catch (err) {
        setError(
          "Failed to initialize Gemma service. Please check your API key in the .env file."
        );
        console.error("Initialization error:", err);
      }
    } else {
      setError(
        "Gemma API key not found. Please add your API key to the .env file."
      );
    }
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleRoleSelect = (role: "Bride" | "Groom") => {
    setUserRole(role);
    setStep("names");
  };

  const handleNamesSubmit = (brideFullName: string, groomFullName: string) => {
    setNames({
      bride: brideFullName,
      groom: groomFullName,
    });
    setStep("promise");
  };

  const handleStorySubmit = async (newStory: string) => {
    if (!gemmaService) return;

    setIsLoading(true);
    setError(null);

    try {
      // Include names in the prompt
      const storyWithNames = newStory
        .replace("[BRIDE]", names.bride)
        .replace("[GROOM]", names.groom);

      // Pass both the story and names to the gemmaService
      const generatedPoem = await gemmaService.storyToPoem(
        storyWithNames,
        names
      );
      setPoem(generatedPoem);
      setStep("poem");
    } catch (err) {
      console.error("Error generating poem:", err);
      setError("Failed to generate poem. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "poem") {
      setStep("promise");
    } else if (step === "promise") {
      setStep("names");
    } else if (step === "names") {
      setStep("selection");
      setUserRole(null);
    }
  };

  // Function to reset to the beginning
  const handleRestart = () => {
    setStep("selection");
    setUserRole(null);
    setNames({ bride: "", groom: "" });
    setPoem(null);
  };

  // Render error message if API key is missing
  if (!config.gemmaApiKey) {
    return (
      <div className="bg-page min-h-screen w-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4">
            API Key Missing
          </h2>
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            Gemma API key not found in environment variables.
          </div>
          <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-line">
            {apiKeyInstructions}
          </div>
        </div>
      </div>
    );
  }

  // Determine the content to display based on the current step
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center py-8">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-base">Transforming your promise...</p>
        </div>
      );
    }

    switch (step) {
      case "selection":
        return <BrideGroomSelect onSelect={handleRoleSelect} />;
      case "names":
        return (
          <NameInputForm
            onSubmit={handleNamesSubmit}
            onBack={handleBack}
            role={userRole}
          />
        );
      case "promise":
        return (
          <StoryInput
            onSubmit={handleStorySubmit}
            isLoading={isLoading}
            onBack={handleBack}
            role={userRole}
            names={names}
          />
        );
      case "poem":
        return (
          <PoemDisplay
            poem={poem}
            onBack={handleBack}
            onRestart={handleRestart}
            names={names}
          />
        );
      default:
        return null;
    }
  };

  const getBackgroundClass = () => {
    return "bg-page";
  };

  const showBackButton = () => {
    return step !== "selection";
  };

  return (
    <div className={`min-h-screen w-full ${getBackgroundClass()}`}>
      {/* Background Music Component */}
      <BackgroundMusic />

      {/* Error display if needed */}
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-red-100 border-b border-red-400 text-red-700 text-center">
          {error}
        </div>
      )}

      {/* Header with Navigation Progress */}
      <header
        className={`fixed top-0 left-0 right-0 z-10 p-4 transition-all duration-300 ${
          isScrolled ? "bg-white bg-opacity-80 shadow-md" : ""
        }`}
      >
        <div className="container mx-auto flex justify-center items-center">
          <NavigationProgress
            currentStep={getCurrentStepNumber()}
            totalSteps={4}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto pt-24 px-4 pb-16 flex flex-col items-center">
        {showBackButton() && (
          <div className="self-start mb-6">
            <BackArrow onBack={handleBack} />
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
