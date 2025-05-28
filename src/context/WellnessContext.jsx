import React, { createContext, useContext, useState } from 'react';

// Create the initial context
const WellnessContext = createContext(null);

// Create a provider component
export const WellnessProvider = ({ children }) => {
  const [jobTips, setJobTips] = useState([
    { id: 1, tip: 'Take a 5-minute break from your screen every hour to reduce eye strain' },
    { id: 2, tip: 'Use proper ergonomic positioning for your desk setup to avoid back pain' },
    { id: 3, tip: 'Try standing for meetings or using a standing desk for part of your day' }
  ]);
  
  const [weeklyFocus, setWeeklyFocus] = useState({
    topic: 'Eye Health',
    description: 'Computer users should follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for at least 20 seconds.',
  });

  // Function to add a new job tip
  const addJobTip = (tip) => {
    setJobTips(prev => [...prev, {
      id: Date.now(),
      tip
    }]);
  };

  // Function to update weekly focus
  const updateWeeklyFocus = (focus) => {
    setWeeklyFocus(focus);
  };

  // Function to set a reminder
  const setReminder = (type) => {
    // In a real app, this would integrate with the device's notification system
    console.log(`Reminder set for ${type}`);
    return true;
  };

  return (
    <WellnessContext.Provider value={{
      jobTips,
      weeklyFocus,
      addJobTip,
      updateWeeklyFocus,
      setReminder
    }}>
      {children}
    </WellnessContext.Provider>
  );
};

// Create a custom hook to use the context
export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};

export default WellnessContext;