import React, { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import GoalSetupModal from '../components/GoalSetupModal';
import { Button } from '@/components/ui/button';
import { SpendingGoalProvider } from '../contexts/SpendingGoalContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

const Index = () => {
  const { profile } = useUserProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  // Fetch expenses from Supabase
  const fetchExpenses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        toast({
          title: "Error",
          description: "Failed to load expenses",
          variant: "destructive",
        });
        return;
      }

      // Transform database format to component format
      const transformedExpenses = data.map(expense => ({
        id: expense.id,
        amount: parseFloat(expense.amount),
        description: expense.description,
        category: expense.category,
        date: expense.date
      }));

      setExpenses(transformedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: expense.amount.toString(),
          description: expense.description,
          category: expense.category,
          date: expense.date
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding expense:', error);
        toast({
          title: "Error",
          description: "Failed to add expense",
          variant: "destructive",
        });
        return;
      }

      // Transform and add to local state
      const newExpense: Expense = {
        id: data.id,
        amount: parseFloat(data.amount),
        description: data.description,
        category: data.category,
        date: data.date
      };

      setExpenses(prev => [newExpense, ...prev]);
      setShowExpenseForm(false);
      
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting expense:', error);
        toast({
          title: "Error",
          description: "Failed to delete expense",
          variant: "destructive",
        });
        return;
      }

      setExpenses(prev => prev.filter(expense => expense.id !== id));
      
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <SpendingGoalProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your expenses...</p>
            </div>
          </main>
        </div>
      </SpendingGoalProvider>
    );
  }

  return (
    <SpendingGoalProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
            <p className="text-gray-600">
              Track your expenses in {profile.currency_code} and take control of your finances
            </p>
          </div>

          <Dashboard 
            expenses={expenses} 
            totalSpent={totalSpent} 
            onSetupGoals={() => setShowGoalModal(true)}
          />

          <div className="mt-12 flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Transactions</h2>
            <Button
              onClick={() => setShowExpenseForm(!showExpenseForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>

          {showExpenseForm && (
            <div className="mb-8">
              <ExpenseForm onSubmit={addExpense} onCancel={() => setShowExpenseForm(false)} />
            </div>
          )}

          <ExpenseList expenses={expenses} onDelete={deleteExpense} />

          <GoalSetupModal 
            open={showGoalModal} 
            onOpenChange={setShowGoalModal}
          />
        </main>
      </div>
    </SpendingGoalProvider>
  );
};

export default Index;
