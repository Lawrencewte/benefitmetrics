import React from 'react';

interface DemoHeaderProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ title: string; description: string }>;
  persona: 'nurse' | 'doctor' | 'hr-admin';
}

const personaConfig = {
  nurse: {
    name: 'Jessica Martinez - ICU Nurse',
    color: 'blue'
  },
  doctor: {
    name: 'Dr. Michael Chen - Emergency Physician', 
    color: 'blue'
  },
  'hr-admin': {
    name: 'Sarah Williams - HR Benefits Director',
    color: 'blue'
  }
};

export default function DemoHeader({ currentStep, totalSteps, steps, persona }: DemoHeaderProps) {
  const config = personaConfig[persona];
  
  return (
    <div className="bg-blue-50 p-3 border-b border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-blue-800">Demo: {config.name}</div>
        <div className="text-xs text-blue-600">Step {currentStep + 1} of {totalSteps}</div>
      </div>
      <div className="flex space-x-1">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`flex-1 h-2 rounded ${index <= currentStep ? 'bg-blue-500' : 'bg-blue-200'}`}
          />
        ))}
      </div>
      <div className="mt-2 text-xs text-blue-700">{steps[currentStep]?.description}</div>
    </div>
  );
}