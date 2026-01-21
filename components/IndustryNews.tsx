
import React, { useState, useEffect } from 'react';
import { fetchIndustryInsights } from '../services/geminiService';
import { IndustryNewsItem } from '../types';
import { DEFAULT_INDUSTRIES } from '../constants';

export const IndustryNews: React.FC = () => {
  const [industries, setIndustries] = useState(DEFAULT_INDUSTRIES);
  const [selectedIndustry, setSelectedIndustry] = useState(DEFAULT_INDUSTRIES[0]);
  const [news, setNews] = useState<IndustryNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newIndustryName, setNewIndustryName] = useState('');
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Load from Cache or Fetch
  const loadNews = async (forceRefresh = false) => {
    const cacheKey = `news_cache_${selectedIndustry.id}`;
    const cachedData = localStorage.getItem(cacheKey);

    // If we have valid cache and not forcing refresh, use it
    if (!forceRefresh && cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        // Cache valid for 30 minutes
        if (Date.now() - timestamp < 30 * 60 * 1000) {
            setNews(data);
            setLastUpdated(timestamp);
            return;
        }
      } catch (e) {
        console.warn("Cache parse error", e);
      }
    }

    setLoading(true);
    const data = await fetchIndustryInsights(selectedIndustry.name);
    
    // Sort by timestamp descending
    const sortedData = data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    setNews(sortedData);
    const now = Date.now();
    setLastUpdated(now);
    setLoading(false);

    // Save to cache
    if (sortedData.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify({ data: sortedData, timestamp: now }));
    }
  };

  useEffect(() => {
    loadNews(false);
  }, [selectedIndustry]);

  const handleRefresh = () => {
      loadNews(true);
  };

  const handleAddIndustry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndustryName.trim()) return;
    
    const newInd = {
      id: `custom_${Date.now()}`,
      name: newIndustryName,
      icon: '🔍'
    };
    
    setIndustries([...industries, newInd]);
    setSelectedIndustry(newInd);
    setNewIndustryName('');
    setIsAdding(false);
  };

  // Helper to format date
  const formatTime = (ts: number) => {
      if (!ts) return '';
      const date = new Date(ts);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      return `${month}-${day} ${hour}:${minute}`;
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-emerald-500">📡</span> 行业风向标
        </h3>
        
        <div className="flex items-center gap-2">
            {lastUpdated && (
                <span className="text-[10px] text-slate-500 hidden md:inline">
                    更新于: {formatTime(lastUpdated)}
                </span>
            )}
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className={`text-slate-400 hover:text-white p-1.5 rounded transition-all ${loading ? 'animate-spin' : ''}`}
              title="刷新资讯"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
               </svg>
            </button>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded"
            >
              {isAdding ? '取消' : '+ 添加板块'}
            </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAddIndustry} className="mb-4 flex gap-2">
          <input 
            type="text" 
            value={newIndustryName}
            onChange={(e) => setNewIndustryName(e.target.value)}
            placeholder="输入行业名称 (如: 低空经济)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            autoFocus
          />
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold">
            确认
          </button>
        </form>
      )}
      
      {/* Scrollable Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4">
        {industries.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setSelectedIndustry(ind)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              selectedIndustry.id === ind.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>{ind.icon}</span>
            {ind.name}
          </button>
        ))}
      </div>

      {/* News Grid - Vertical Scroll List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 pb-20 md:pb-0">
        {loading ? (
           Array(4).fill(0).map((_, i) => (
             <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-28 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-slate-800 rounded w-full mb-2"></div>
             </div>
           ))
        ) : (
          news.map((item, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors">
               <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        item.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' :
                        item.sentiment === 'Negative' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                        {item.sentiment === 'Positive' ? '利好' : item.sentiment === 'Negative' ? '利空' : '中性'}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.source}</span>
                 </div>
                 {/* Show specific time if timestamp available, else publishedDate */}
                 <span className="text-[10px] text-slate-600 font-mono">
                    {item.timestamp ? formatTime(item.timestamp) : item.publishedDate}
                 </span>
               </div>
               <h4 className="text-slate-200 font-bold text-sm leading-snug mb-2">{item.title}</h4>
               <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.summary}</p>
            </div>
          ))
        )}
        {news.length === 0 && !loading && (
          <div className="text-center py-10 text-slate-500 text-sm">暂无最新相关资讯</div>
        )}
      </div>
    </div>
  );
};
