
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense } from '../pages/Index';

interface CategoryBreakdownProps {
  expenses: Expense[];
}

const COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6b7280'  // gray
];

const CategoryBreakdown = ({ expenses }: CategoryBreakdownProps) => {
  const data = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: ((amount / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-emerald-600">${data.value.toFixed(2)}</p>
          <p className="text-gray-600 text-sm">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No expenses to display
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.slice(0, 6).map((item, index) => (
          <div key={item.name} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
