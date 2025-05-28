import React, { createContext, useContext, useState } from 'react';
import { useUser } from './UserContext';

// Create the initial context
const IncentivesContext = createContext(null);

// Create a provider component
export const IncentivesProvider = ({ children }) => {
  const { userData, updatePoints } = useUser();
  const [incentives, setIncentives] = useState([
    { id: 1, name: 'Health Insurance Premium Discount', cost: 500, description: '$25 monthly discount on your premiums' },
    { id: 2, name: 'Fitness Membership', cost: 400, description: 'Free 3-month gym membership' },
    { id: 3, name: 'Wellness Day Off', cost: 300, description: 'Extra PTO day for wellness activities' }
  ]);
  
  // Function to redeem an incentive
  const redeemIncentive = (incentiveId) => {
    const incentive = incentives.find(i => i.id === incentiveId);
    
    if (incentive && userData.points >= incentive.cost) {
      // Update points
      updatePoints(userData.points - incentive.cost);
      
      // In a real app, you would also track redeemed incentives
      // setRedeemedIncentives(prev => [...prev, { incentiveId, date: new Date() }]);
      
      return true;
    }
    
    return false;
  };

  // Function to add a new incentive
  const addIncentive = (incentive) => {
    setIncentives(prev => [...prev, {
      id: Date.now(),
      ...incentive
    }]);
  };

  return (
    <IncentivesContext.Provider value={{
      incentives,
      redeemIncentive,
      addIncentive
    }}>
      {children}
    </IncentivesContext.Provider>
  );
};

// Create a custom hook to use the context
export const useIncentives = () => {
  const context = useContext(IncentivesContext);
  if (!context) {
    throw new Error('useIncentives must be used within an IncentivesProvider');
  }
  return context;
};

export default IncentivesContext;