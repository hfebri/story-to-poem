import { useState } from "react";

type BrideGroomSelectProps = {
  onSelect: (role: "Bride" | "Groom") => void;
};

const BrideGroomSelect = ({ onSelect }: BrideGroomSelectProps) => {
  const [selected, setSelected] = useState<"Bride" | "Groom" | null>(null);

  const handleSelect = (role: "Bride" | "Groom") => {
    setSelected(role);
    // Immediately navigate to the next step when a selection is made
    onSelect(role);
  };

  return (
    <div className="w-full max-w-[345px] mx-auto">
      <div className="mb-6 text-center">
        <h1
          className="text-xl sm:text-2xl md:text-3xl font-normal mb-2 tracking-tight"
          style={{
            fontFamily: "Cinzel, serif",
            color: "#000",
          }}
        >
          Are you The Bride or The Groom?
        </h1>
      </div>

      {/* Shine effect container with multiple layers */}
      <div className="relative">
        {/* Outer blur/glow effect */}
        <div
          className="absolute inset-0 rounded-[28px] border-2 border-white border-opacity-50"
          style={{
            filter: "blur(28px)",
          }}
        ></div>

        {/* Inner white stroke with blur */}
        <div
          className="absolute inset-0 rounded-[28px] border-2 border-white border-opacity-60"
          style={{
            filter: "blur(3px)",
          }}
        ></div>

        {/* Main content container - no background, no border */}
        <div className="relative rounded-[28px] p-0 overflow-hidden">
          <div className="flex flex-row justify-stretch">
            <div
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 flex-1 rounded-tl-[28px] rounded-bl-[28px] ${
                selected === "Bride" ? "ring-2 ring-[#873053]" : ""
              }`}
              onClick={() => handleSelect("Bride")}
            >
              <div
                className="w-full overflow-hidden rounded-tl-[28px] rounded-bl-[28px]"
                style={{ height: "398px" }}
              >
                <img
                  src="/bride_image.png"
                  alt="Bride"
                  className="w-full h-full object-cover object-center"
                  style={{ objectPosition: "center" }}
                />
              </div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-white px-4 py-2 rounded-full shadow-md">
                  <span
                    className="text-lg"
                    style={{ fontFamily: "Glegoo, serif" }}
                  >
                    Bride
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 flex-1 rounded-tr-[28px] rounded-br-[28px] ${
                selected === "Groom" ? "ring-2 ring-[#873053]" : ""
              }`}
              onClick={() => handleSelect("Groom")}
            >
              <div
                className="w-full overflow-hidden rounded-tr-[28px] rounded-br-[28px]"
                style={{ height: "398px" }}
              >
                <img
                  src="/groom_image.png"
                  alt="Groom"
                  className="w-full h-full object-cover object-center scale-x-[-1]"
                  style={{ objectPosition: "center" }}
                />
              </div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-white px-4 py-2 rounded-full shadow-md">
                  <span
                    className="text-lg"
                    style={{ fontFamily: "Glegoo, serif" }}
                  >
                    Groom
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrideGroomSelect;
