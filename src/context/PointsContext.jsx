import { createContext, useContext, useState } from 'react';

// Create the initial context
const PointsContext = createContext(null);

// Create a provider component
export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(250);
  const [pointsHistory, setPointsHistory] = useState([
    { id: 1, description: 'Annual Physical Completed', points: 100, date: '2025-04-10' },
    { id: 2, description: 'Dental Check-up Completed', points: 75, date: '2025-04-20' },
    { id: 3, description: 'Weekly Step Challenge', points: 50, date: '2025-05-01' },
    { id: 4, description: 'Health Assessment Completed', points: 25, date: '2025-05-10' },
  ]);
  const [pointsGoal, setPointsGoal] = useState(500);

  // Add points to user's balance
  const addPoints = (amount, description) => {
    setPoints(prev => prev + amount);
    
    // Add to history
    const newHistoryItem = {
      id: Date.now(),
      description,
      points: amount,
      date: new Date().toISOString().split('T')[0]
    };
    
    setPointsHistory(prev => [newHistoryItem, ...prev]);
    
    // In a real app, this would synchronize with the server
    // api.post('/points/add', { amount, description });
  };

  // Subtract points from user's balance
  const subtractPoints = (amount, description) => {
    // Check if user has enough points
    if (points < amount) {
      throw new Error('Insufficient points');
    }
    
    setPoints(prev => prev - amount);
    
    // Add to history
    const newHistoryItem = {
      id: Date.now(),
      description,
      points: -amount,
      date: new Date().toISOString().split('T')[0]
    };
    
    setPointsHistory(prev => [newHistoryItem, ...prev]);
    
    // In a real app, this would synchronize with the server
    // api.post('/points/subtract', { amount, description });
  };

  // Set points goal
  const updatePointsGoal = (goal) => {
    setPointsGoal(goal);
    
    // In a real app, this would synchronize with the server
    // api.post('/points/goal', { goal });
  };

  // Calculate progress towards goal (as percentage)
  const getGoalProgress = () => {
    return Math.min(100, Math.round((points / pointsGoal) * 100));
  };

  // Get points balance
  const getPointsBalance = () => {
    return points;
  };

  // Get recent points activity
  const getRecentActivity = (limit = 5) => {
    return pointsHistory.slice(0, limit);
  };

  return (
    <PointsContext.Provider value={{
      points,
      pointsHistory,
      pointsGoal,
      addPoints,
      subtractPoints,
      updatePointsGoal,
      getGoalProgress,
      getPointsBalance,
      getRecentActivity
    }}>
      {children}
    </PointsContext.Provider>
  );
};

// Create a custom hook to use the context
export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export default PointsContext;