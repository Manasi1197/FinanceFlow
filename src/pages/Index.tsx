
import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import GoalSetupModal from '../components/GoalSetupModal';
import { Button } from '@/components/ui/button';
import { SpendingGoalProvider } from '../contexts/SpendingGoalContext';
import { useUserProfile } from '@/hooks/useUserProfile';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

const Index = () => {
  const { profile } = useUserProfile();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses(prev => [newExpense, ...prev]);
    setShowExpenseForm(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
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
