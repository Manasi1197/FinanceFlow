
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SpendingGoals {
  monthly: number;
  yearly: number;
}

interface SpendingGoalContextType {
  goals: SpendingGoals;
  setGoals: (goals: SpendingGoals) => void;
  hasGoals: boolean;
}

const SpendingGoalContext = createContext<SpendingGoalContextType | undefined>(undefined);

export const useSpendingGoal = () => {
  const context = useContext(SpendingGoalContext);
  if (!context) {
    throw new Error('useSpendingGoal must be used within a SpendingGoalProvider');
  }
  return context;
};

interface SpendingGoalProviderProps {
  children: React.ReactNode;
}

export const SpendingGoalProvider = ({ children }: SpendingGoalProviderProps) => {
  const [goals, setGoalsState] = useState<SpendingGoals>({ monthly: 0, yearly: 0 });

  useEffect(() => {
    const savedGoals = localStorage.getItem('spendingGoals');
    if (savedGoals) {
      setGoalsState(JSON.parse(savedGoals));
    }
  }, []);

  const setGoals = (newGoals: SpendingGoals) => {
    setGoalsState(newGoals);
    localStorage.setItem('spendingGoals', JSON.stringify(newGoals));
  };

  const hasGoals = goals.monthly > 0 || goals.yearly > 0;

  return (
    <SpendingGoalContext.Provider value={{ goals, setGoals, hasGoals }}>
      {children}
    </SpendingGoalContext.Provider>
  );
};
