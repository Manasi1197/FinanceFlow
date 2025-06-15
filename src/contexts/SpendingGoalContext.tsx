
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SpendingGoals {
  monthly: number;
  yearly: number;
}

interface SpendingGoalContextType {
  goals: SpendingGoals;
  setGoals: (goals: SpendingGoals) => void;
  hasGoals: boolean;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch goals from Supabase
  const fetchGoals = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('spending_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching spending goals:', error);
        return;
      }

      if (data) {
        setGoalsState({
          monthly: parseFloat(data.monthly_goal || '0'),
          yearly: parseFloat(data.yearly_goal || '0')
        });
      }
    } catch (error) {
      console.error('Error fetching spending goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const setGoals = async (newGoals: SpendingGoals) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('spending_goals')
        .upsert({
          user_id: user.id,
          monthly_goal: newGoals.monthly || null,
          yearly_goal: newGoals.yearly || null
        });

      if (error) {
        console.error('Error saving spending goals:', error);
        toast({
          title: "Error",
          description: "Failed to save spending goals",
          variant: "destructive",
        });
        return;
      }

      setGoalsState(newGoals);
      toast({
        title: "Success",
        description: "Spending goals saved successfully",
      });
    } catch (error) {
      console.error('Error saving spending goals:', error);
      toast({
        title: "Error",
        description: "Failed to save spending goals",
        variant: "destructive",
      });
    }
  };

  const hasGoals = goals.monthly > 0 || goals.yearly > 0;

  return (
    <SpendingGoalContext.Provider value={{ goals, setGoals, hasGoals, loading }}>
      {children}
    </SpendingGoalContext.Provider>
  );
};
