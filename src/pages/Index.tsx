
import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { Button } from '@/components/ui/button';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      amount: 89.50,
      description: 'Grocery shopping',
      category: 'Food & Dining',
      date: '2025-06-14'
    },
    {
      id: '2',
      amount: 45.00,
      description: 'Gas station',
      category: 'Transportation',
      date: '2025-06-13'
    },
    {
      id: '3',
      amount: 120.00,
      description: 'Monthly gym membership',
      category: 'Health & Fitness',
      date: '2025-06-12'
    }
  ]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Track your expenses and take control of your finances</p>
        </div>

        <Dashboard expenses={expenses} totalSpent={totalSpent} />

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
      </main>
    </div>
  );
};

export default Index;
