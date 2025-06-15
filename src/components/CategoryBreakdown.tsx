
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense } from '../pages/Index';
import { useUserProfile } from '@/hooks/useUserProfile';

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
  const { profile } = useUserProfile();
  const currencySymbol = profile?.currency_symbol || '$';

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

  const CustomTooltip = ({ active, payload, coordinate }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded-lg shadow-xl border border-gray-200 text-sm max-w-48">
          <p className="font-semibold text-gray-800 truncate">{data.name}</p>
          <p className="text-emerald-600 font-medium">{currencySymbol}{data.value.toFixed(2)}</p>
          <p className="text-gray-600 text-xs">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-gray-500">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-lg font-medium">No expenses to display</p>
        <p className="text-sm">Add some expenses to see your spending breakdown</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="h-72 relative overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              position={{ x: undefined, y: undefined }}
              allowEscapeViewBox={{ x: false, y: false }}
              wrapperStyle={{ 
                zIndex: 1000,
                pointerEvents: 'none'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text with total */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <p className="text-2xl font-bold text-gray-800">
              {currencySymbol}{expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">Total Spent</p>
          </div>
        </div>
      </div>
      
      {/* Legend Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Category Breakdown</h4>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium text-gray-800 truncate">{item.name}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-800">{currencySymbol}{item.value.toFixed(2)}</p>
                <p className="text-xs text-gray-600">{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
