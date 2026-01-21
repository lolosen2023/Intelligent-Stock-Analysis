import React, { useMemo } from 'react';
import { INVESTMENT_QUOTES } from '../constants';

interface QuoteBannerProps {
  username?: string;
}

export const QuoteBanner: React.FC<QuoteBannerProps> = ({ username }) => {
  const quote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * INVESTMENT_QUOTES.length);
    return INVESTMENT_QUOTES[randomIndex];
  }, []);

  return (
    <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900 border-b border-slate-800 px-4 py-4 mb-6">
      <div className="max-w-7xl mx-auto">
        {username && (
           <h3 className="text-white font-bold text-lg mb-1">
             您好，{username} 👋
           </h3>
        )}
        <div className="flex items-center gap-3">
          <span className="text-emerald-500 text-xl">💡</span>
          <p className="text-sm font-medium text-slate-300 italic tracking-wide">
            "{quote}"
          </p>
        </div>
      </div>
    </div>
  );
};
