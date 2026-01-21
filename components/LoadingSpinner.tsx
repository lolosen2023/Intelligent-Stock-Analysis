import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    </div>
    <p className="text-emerald-500 font-medium animate-pulse">正在分析市场数据...</p>
    <p className="text-xs text-slate-500">正在接入机构数据源与最新资讯</p>
  </div>
);
