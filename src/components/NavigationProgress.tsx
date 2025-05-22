import React from "react";

type NavigationProgressProps = {
  currentStep: number;
  totalSteps: number;
};

const NavigationProgress: React.FC<NavigationProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 w-full max-w-[301px] mx-auto my-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          {/* Star element */}
          <div className="w-6 h-6 flex items-center justify-center">
            {index + 1 === currentStep ? (
              // Current step - larger star
              <img
                src="/icons/star-fill.svg"
                alt="Current step"
                className="w-4 h-4"
              />
            ) : index < currentStep ? (
              // Completed step
              <img
                src="/icons/star-fill.svg"
                alt="Completed step"
                className="w-3 h-3"
              />
            ) : (
              // Upcoming step
              <img
                src="/icons/star-no-fill.svg"
                alt="Upcoming step"
                className="w-3 h-3"
              />
            )}
          </div>

          {/* Line element (only between stars, not after the last star) */}
          {index < totalSteps - 1 && (
            <div className="flex-grow flex items-center">
              <img src="/icons/line.svg" alt="-" className="w-full" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NavigationProgress;
