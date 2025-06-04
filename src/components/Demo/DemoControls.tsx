import React from 'react';

interface DemoControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function DemoControls({ currentStep, totalSteps, onPrevious, onNext }: DemoControlsProps) {
  return (
    <div className="bg-gray-100 p-3 border-t flex justify-between items-center">
      <button 
        onClick={onPrevious}
        disabled={currentStep === 0}
        className={`px-3 py-1 rounded text-sm ${
          currentStep === 0 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Previous
      </button>
      <div className="text-sm text-gray-600">Click features to explore</div>
      <button 
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className={`px-3 py-1 rounded text-sm ${
          currentStep === totalSteps - 1 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Next
      </button>
    </div>
  );
}