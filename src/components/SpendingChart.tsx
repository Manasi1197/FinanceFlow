
import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Expense } from '../pages/Index';
import { useUserProfile } from '@/hooks/useUserProfile';

interface SpendingChartProps {
  expenses: Expense[];
}

type TimeFilter = 'daily' | 'weekly' | 'monthly';

const SpendingChart = ({ expenses }: SpendingChartProps) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('daily');
  const { profile } = useUserProfile();
  const currencySymbol = profile?.currency_symbol || '$';

  // Filter expenses to current year only
  const currentYearExpenses = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return expenses.filter(expense => {
      const expenseYear = new Date(expense.date).getFullYear();
      return expenseYear === currentYear;
    });
  }, [expenses]);

  const data = useMemo(() => {
    const now = new Date();
    
    if (timeFilter === 'daily') {
      // Last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }

      return last7Days.map(date => {
        const dayExpenses = currentYearExpenses.filter(expense => expense.date === date);
        const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        return {
          date: new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          amount: totalAmount,
          fullDate: date
        };
      });
    }

    if (timeFilter === 'weekly') {
      // Last 8 weeks
      const weeks = [];
      for (let i = 7; i >= 0; i--) {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - (i * 7) - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        weeks.push({
          start: startOfWeek.toISOString().split('T')[0],
          end: endOfWeek.toISOString().split('T')[0],
          label: `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        });
      }

      return weeks.map(week => {
        const weekExpenses = currentYearExpenses.filter(expense => {
          return expense.date >= week.start && expense.date <= week.end;
        });
        const totalAmount = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        return {
          date: week.label,
          amount: totalAmount,
          fullDate: week.start
        };
      });
    }

    if (timeFilter === 'monthly') {
      // Last 12 months
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          year: date.getFullYear(),
          month: date.getMonth(),
          label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        });
      }

      return months.map(month => {
        const monthExpenses = currentYearExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === month.year && expenseDate.getMonth() === month.month;
        });
        const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        return {
          date: month.label,
          amount: totalAmount,
          fullDate: `${month.year}-${String(month.month + 1).padStart(2, '0')}-01`
        };
      });
    }

    return [];
  }, [currentYearExpenses, timeFilter]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-emerald-600">{currencySymbol}{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  if (currentYearExpenses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'monthly'] as TimeFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(filter)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No spending data to display for this year
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {(['daily', 'weekly', 'monthly'] as TimeFilter[]).map((filter) => (
          <Button
            key={filter}
            variant={timeFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter(filter)}
            className="capitalize"
          >
            {filter}
          </Button>
        ))}
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `${currencySymbol}${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;
