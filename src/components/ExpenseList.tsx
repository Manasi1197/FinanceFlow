
import React from 'react';
import { Trash2, Calendar, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Expense } from '../pages/Index';
import { useUserProfile } from '@/hooks/useUserProfile';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const categoryColors: { [key: string]: string } = {
  'Food & Dining': 'bg-orange-100 text-orange-800 border-orange-200',
  'Transportation': 'bg-blue-100 text-blue-800 border-blue-200',
  'Shopping': 'bg-purple-100 text-purple-800 border-purple-200',
  'Entertainment': 'bg-pink-100 text-pink-800 border-pink-200',
  'Health & Fitness': 'bg-green-100 text-green-800 border-green-200',
  'Bills & Utilities': 'bg-red-100 text-red-800 border-red-200',
  'Travel': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Education': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Other': 'bg-gray-100 text-gray-800 border-gray-200'
};

const ExpenseList = ({ expenses, onDelete }: ExpenseListProps) => {
  const { profile } = useUserProfile();
  const currencySymbol = profile?.currency_symbol || '$';

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
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="py-16 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">No expenses yet</h3>
              <p className="text-gray-600 max-w-sm">Start tracking your expenses by adding your first transaction above.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense, index) => (
        <Card 
          key={expense.id} 
          className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 group"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 break-words leading-tight">
                      {expense.description}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${categoryColors[expense.category] || categoryColors['Other']} self-start sm:flex-shrink-0`}>
                    <Tag className="w-3 h-3 mr-1" />
                    {expense.category}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{formatDate(expense.date)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-3 sm:gap-2 sm:ml-4">
                <div className="text-left sm:text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {currencySymbol}{expense.amount.toFixed(2)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
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
