import { useState } from "react";

type NameInputFormProps = {
  onSubmit: (brideFullName: string, groomFullName: string) => void;
  onBack?: () => void;
  role: "Bride" | "Groom" | null;
};

const NameInputForm = ({ onSubmit, onBack, role }: NameInputFormProps) => {
  const [brideFullName, setBrideFullName] = useState<string>("");
  const [groomFullName, setGroomFullName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brideFullName.trim() && groomFullName.trim()) {
      onSubmit(brideFullName, groomFullName);
    }
  };

  return (
    <div className="w-full max-w-[345px] mx-auto">
      <div className="text-center mb-8">
        <h1
          className="text-xl sm:text-2xl md:text-3xl font-normal mb-2 tracking-tight"
          style={{
            fontFamily: "Cinzel, serif",
          }}
        >
          Tell us your names, to weave them into your promise.
        </h1>
        <p
          className="text-sm sm:text-base"
          style={{ fontFamily: "Glegoo, serif" }}
        >
          These name will be used as special packaging engraving.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="bg-white bg-opacity-55 border-2 border-[#ECDFE4] rounded-full px-4 py-3">
            <input
              type="text"
              value={role === "Groom" ? groomFullName : brideFullName}
              onChange={(e) =>
                role === "Groom"
                  ? setGroomFullName(e.target.value)
                  : setBrideFullName(e.target.value)
              }
              placeholder={`${role || "Your"} full name`}
              required
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center"
              style={{ fontFamily: "Glegoo, serif" }}
            />
          </div>

          <div className="bg-white bg-opacity-55 border-2 border-[#ECDFE4] rounded-full px-4 py-3">
            <input
              type="text"
              value={role === "Groom" ? brideFullName : groomFullName}
              onChange={(e) =>
                role === "Groom"
                  ? setBrideFullName(e.target.value)
                  : setGroomFullName(e.target.value)
              }
              placeholder={`${role === "Groom" ? "Bride" : "Groom"} full name`}
              required
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center"
              style={{ fontFamily: "Glegoo, serif" }}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!brideFullName.trim() || !groomFullName.trim()}
            className={`px-5 py-2.5 text-white font-bold rounded-full text-center ${
              !brideFullName.trim() || !groomFullName.trim()
                ? "bg-[#873053] opacity-70 cursor-not-allowed"
                : "bg-[#873053] hover:bg-[#973063] focus:outline-none"
            }`}
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default NameInputForm;
