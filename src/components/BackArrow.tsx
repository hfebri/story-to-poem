import React from "react";

type BackArrowProps = {
  onBack: () => void;
};

const BackArrow: React.FC<BackArrowProps> = ({ onBack }) => {
  return (
    <button
      onClick={onBack}
      className="w-8 h-8 flex items-center justify-center cursor-pointer"
      aria-label="Go back"
    >
      <img src="/icons/arrow-left.svg" alt="Back" className="w-6 h-6" />
    </button>
  );
};

export default BackArrow;
