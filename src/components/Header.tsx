
import React from 'react';
import { TrendingUp, Wallet } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-2 rounded-xl shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FinanceFlow</h1>
              <p className="text-sm text-gray-600">Smart expense tracking</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
