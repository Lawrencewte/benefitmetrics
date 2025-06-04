import React, { createContext, ReactNode, useContext, useState } from 'react';

interface DemoStep {
  title: string;
  description: string;
}

interface DemoContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  demoSteps: DemoStep[];
  setDemoSteps: (steps: DemoStep[]) => void;
  resetDemo: () => void;
  isCompleted: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

interface DemoProviderProps {
  children: ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([]);

  const resetDemo = () => {
    setCurrentStep(0);
  };

  const isCompleted = currentStep >= demoSteps.length - 1;

  const value: DemoContextType = {
    currentStep,
    setCurrentStep,
    demoSteps,
    setDemoSteps,
    resetDemo,
    isCompleted
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoContext() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
}