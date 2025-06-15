
import React from 'react';
import { Trash2, Calendar, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Expense } from '../pages/Index';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const categoryColors: { [key: string]: string } = {
  'Food & Dining': 'bg-orange-100 text-orange-800',
  'Transportation': 'bg-blue-100 text-blue-800',
  'Shopping': 'bg-purple-100 text-purple-800',
  'Entertainment': 'bg-pink-100 text-pink-800',
  'Health & Fitness': 'bg-green-100 text-green-800',
  'Bills & Utilities': 'bg-red-100 text-red-800',
  'Travel': 'bg-indigo-100 text-indigo-800',
  'Education': 'bg-yellow-100 text-yellow-800',
  'Other': 'bg-gray-100 text-gray-800'
};

const ExpenseList = ({ expenses, onDelete }: ExpenseListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (expenses.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="py-12 text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
          <p className="text-gray-600">Start tracking your expenses by adding your first transaction.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense, index) => (
        <Card 
          key={expense.id} 
          className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{expense.description}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[expense.category] || categoryColors['Other']}`}>
                    <Tag className="w-3 h-3 mr-1" />
                    {expense.category}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(expense.date)}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseList;
