
import React from 'react';
import { KeyMetrics } from '../types';

interface MetricsGridProps {
  metrics: KeyMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  if (!metrics) return null;

  const getRiskColor = (score: number) => {
    if (score < 30) return 'bg-emerald-500';
    if (score < 60) return 'bg-yellow-500';
    return 'bg-rose-500';
  };

  const getSentimentColor = (s: string) => {
    if (s === 'Bullish') return 'text-rose-400'; // Red for Bullish
    if (s === 'Bearish') return 'text-emerald-400'; // Green for Bearish
    return 'text-slate-400';
  };
  
  const getSentimentText = (s: string) => {
      if (s === 'Bullish') return '看多 🐂';
      if (s === 'Bearish') return '看空 🐻';
      return '观望 😐';
  };
  
  const getRecommendationConfig = (rec: string) => {
      switch(rec) {
          case 'Buy': return { text: '强力买入', color: 'text-rose-400', bg: 'bg-rose-500/10' };
          case 'Buy_Dip': return { text: '逢低吸纳', color: 'text-rose-300', bg: 'bg-rose-500/10' };
          case 'Sell': return { text: '坚决卖出', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
          case 'Hold': return { text: '持股观望', color: 'text-blue-400', bg: 'bg-blue-500/10' };
          case 'Wait': return { text: '空仓等待', color: 'text-slate-400', bg: 'bg-slate-500/10' };
          default: return { text: '观望', color: 'text-slate-400', bg: 'bg-slate-500/10' };
      }
  };

  const recConfig = getRecommendationConfig(metrics.recommendation);
  const changePercent = String(metrics.changePercent || '0%');
  const isNegative = changePercent.includes('-');

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Price Card */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
        <span className="text-xs text-slate-500 uppercase tracking-wider">当前价格</span>
        <div className="mt-2">
          <div className="text-2xl font-bold text-white font-mono">{metrics.price || '--'}</div>
          <div className={`text-sm font-medium flex items-center gap-1 ${isNegative ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span>{isNegative ? '▼' : '▲'}</span>
            {changePercent}
          </div>
        </div>
      </div>

      {/* Risk Radar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex justify-between items-center">
             <span className="text-xs text-slate-500 uppercase tracking-wider">风险指数</span>
             <span className={`text-xs font-bold ${getRiskColor(metrics.riskScore || 0).replace('bg-', 'text-')}`}>{metrics.riskScore || 0}/100</span>
        </div>
        <div className="mt-4 w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-2.5 rounded-full ${getRiskColor(metrics.riskScore || 0)} transition-all duration-1000 ease-out`} 
            style={{ width: `${metrics.riskScore || 0}%` }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-slate-400 text-right">
            {(metrics.riskScore || 0) > 60 ? '高风险' : (metrics.riskScore || 0) > 30 ? '中风险' : '低风险'}
        </div>
      </div>

      {/* Sentiment */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
        <span className="text-xs text-slate-500 uppercase tracking-wider">市场情绪</span>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xl font-bold ${getSentimentColor(metrics.sentiment)}`}>
            {getSentimentText(metrics.sentiment)}
          </span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
            趋势: {metrics.trend === 'Up' ? '上升' : metrics.trend === 'Down' ? '下降' : '震荡'}
        </div>
      </div>

       {/* Recommendation */}
       <div className={`border border-slate-800 p-4 rounded-xl flex flex-col justify-between relative overflow-hidden transition-colors group ${recConfig.bg}`}>
        <span className="text-xs text-slate-500 uppercase tracking-wider">AI 建议</span>
        <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity">
             <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                 <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
             </svg>
        </div>
        <div className="mt-2 z-10">
           <span className={`text-2xl font-black tracking-widest ${recConfig.color}`}>
               {recConfig.text}
           </span>
        </div>
      </div>
    </div>
  );
};
