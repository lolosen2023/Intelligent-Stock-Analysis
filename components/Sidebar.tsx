
import React from 'react';

interface SidebarProps {
  username: string;
  activeTab: string;
  onTabChange: (tab: 'trends' | 'analysis' | 'learning' | 'profile') => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ username, activeTab, onTabChange, onLogout }) => {
  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-slate-950 border-r border-slate-900 fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-slate-900">
        <h1 className="font-bold text-xl text-slate-100 flex items-center gap-2">
           <span className="text-emerald-500">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M6 16.5v2.25m0-2.25h2.25m-2.25-2.25v-2.25m0 2.25h2.25m-2.25-2.25v-2.25m0 2.25h2.25m0 2.25v2.25m0-2.25h2.25M13.5 6H18m0 0v12m0-12-6 6" />
             </svg>
           </span>
           智投分析
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">菜单</div>
        
        <button 
          onClick={() => onTabChange('trends')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'trends' ? 'bg-slate-900 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
        >
           <span className="text-xl">📡</span>
           行业风向标
        </button>

        <button 
          onClick={() => onTabChange('analysis')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'analysis' ? 'bg-slate-900 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
        >
           <span className="text-xl">📈</span>
           智能股票分析
        </button>
        
        <button 
          onClick={() => onTabChange('learning')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'learning' ? 'bg-slate-900 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
        >
           <span className="text-xl">🎓</span>
           投资学堂
        </button>

        <button 
          onClick={() => onTabChange('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-slate-900 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
        >
           <span className="text-xl">👤</span>
           个人中心
        </button>
      </nav>

      <div className="p-4 border-t border-slate-900">
        <div className="flex items-center gap-3 px-4 mb-4">
           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-500 font-bold">
              {username.charAt(0).toUpperCase()}
           </div>
           <div className="flex-1 overflow-hidden">
              <p className="text-sm text-white font-medium truncate">{username}</p>
              <p className="text-xs text-slate-500">专业版用户</p>
           </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-slate-400 text-sm hover:text-white rounded-lg transition-colors"
        >
           退出登录
        </button>
      </div>
    </div>
  );
};
