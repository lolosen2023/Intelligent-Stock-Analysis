
import React, { useState, useEffect } from 'react';
import { User, LoadingState, AnalysisReport } from './types';
import { generateStockAnalysis } from './services/geminiService';
import { MarkdownViewer } from './components/MarkdownViewer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { StockChart } from './components/StockChart';
import { IndustryNews } from './components/IndustryNews';
import { MetricsGrid } from './components/MetricsGrid';
import { Sidebar } from './components/Sidebar';
import { QuoteBanner } from './components/QuoteBanner';
import { Profile } from './components/Profile';
import { PatternLearning } from './components/PatternLearning';
import { MOCK_REPORT_DATA } from './constants';

// Icons
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M6 16.5v2.25m0-2.25h2.25m-2.25-2.25v-2.25m0 2.25h2.25m0 2.25v2.25m0-2.25h2.25M13.5 6H18m0 0v12m0-12-6 6" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'trends' | 'analysis' | 'learning' | 'profile'>('trends');

  // Analysis State
  const [stockInput, setStockInput] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Auth Form State
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Auto-login check and restore state
  useEffect(() => {
    const storedUser = localStorage.getItem('stock_app_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const lastStock = localStorage.getItem('last_stock_code');
    if (lastStock) {
       setStockInput(lastStock);
    }
  }, []);

  // Load Mock Data if no report is present initially
  useEffect(() => {
    if (!report && loadingState === LoadingState.IDLE) {
       setReport(MOCK_REPORT_DATA as unknown as AnalysisReport);
    }
  }, [report, loadingState]);

  const resetAuthForm = () => {
    setAuthUsername('');
    setAuthPassword('');
    setAuthConfirmPassword('');
    setAuthError(null);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    resetAuthForm();
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authUsername || !authPassword) {
      setAuthError("请输入用户名和密码");
      return;
    }
    if (authMode === 'register') {
      if (authUsername.length < 3) { setAuthError("用户名至少需要3个字符"); return; }
      if (authPassword.length < 6) { setAuthError("密码长度不能少于6位"); return; }
      if (authPassword !== authConfirmPassword) { setAuthError("两次输入的密码不一致"); return; }
    }
    setTimeout(() => {
      const newUser = { username: authUsername, isLoggedIn: true };
      setUser(newUser);
      localStorage.setItem('stock_app_user', JSON.stringify(newUser));
      resetAuthForm();
    }, 500);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('stock_app_user');
    setReport(null);
    setStockInput('');
    setActiveTab('trends');
  };

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockInput.trim()) return;

    setLoadingState(LoadingState.SEARCHING);
    setErrorMsg(null);
    setReport(null);
    
    // Persist search
    localStorage.setItem('last_stock_code', stockInput);

    try {
      setLoadingState(LoadingState.ANALYZING);
      const { markdown, jsonData } = await generateStockAnalysis(stockInput);
      setReport({
        markdownContent: markdown,
        chartData: jsonData?.chartData || [],
        chartMarkers: jsonData?.chartMarkers || [],
        chartPatterns: jsonData?.chartPatterns || [],
        keyMetrics: jsonData?.keyMetrics || null,
        stockName: stockInput.toUpperCase(),
        timestamp: Date.now()
      });
      setLoadingState(LoadingState.COMPLETED);
    } catch (err: any) {
      setLoadingState(LoadingState.ERROR);
      // Safe error message handling
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "分析失败，请稍后重试。");
    }
  };

  // --- Auth View ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-500/10 p-4 rounded-full"><ChartIcon /></div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 text-white">智能股票分析师</h2>
          <p className="text-slate-400 text-center mb-8 text-sm">AI 驱动的量化与基本面深度分析</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">用户名</label>
              <input type="text" required value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-600" placeholder="请输入用户名" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">密码</label>
              <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-600" placeholder={authMode === 'register' ? "设置密码 (至少6位)" : "请输入密码"} />
            </div>
            {authMode === 'register' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-slate-400 mb-1">确认密码</label>
                <input type="password" required value={authConfirmPassword} onChange={(e) => setAuthConfirmPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-600" placeholder="请再次输入密码" />
              </div>
            )}
            {authError && <div className="text-rose-400 text-sm bg-rose-500/10 p-2 rounded text-center">{authError}</div>}
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors mt-4 shadow-lg shadow-emerald-900/20">{authMode === 'login' ? '立即登录' : '注册账户'}</button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={toggleAuthMode} className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">{authMode === 'login' ? "还没有账号？去注册" : "已有账号？去登录"}</button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Dashboard ---
  return (
    <div className="flex min-h-screen bg-slate-900">
      
      {/* Sidebar (Desktop) */}
      <Sidebar username={user.username} activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="md:hidden flex-shrink-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center z-30">
           <div className="flex items-center gap-2">
             <div className="text-emerald-500"><ChartIcon /></div>
             <h1 className="font-bold text-lg text-slate-100">智投分析</h1>
           </div>
           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-500">
             {user.username.charAt(0).toUpperCase()}
           </div>
        </header>

        {/* Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-slate-950">
          
          <QuoteBanner username={user.username} />

          <div className="p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-8">
            
            {/* TAB 1: Industry Trends */}
            {activeTab === 'trends' && (
               <IndustryNews />
            )}

            {/* TAB 2: Analysis */}
            {activeTab === 'analysis' && (
              <div className="animate-fade-in">
                 <div className="mb-6 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white mb-2">智能股票分析</h2>
                    <p className="text-slate-400 text-sm">AI 驱动的全维度诊断 (6个月K线 + 形态识别)</p>
                 </div>

                 {/* Search Box */}
                 <form onSubmit={handleAnalysis} className="relative mb-8 max-w-2xl mx-auto md:mx-0">
                   <input 
                     type="text" 
                     value={stockInput}
                     onChange={(e) => setStockInput(e.target.value)}
                     placeholder="输入代码或名称 (如 600519)"
                     className={`w-full bg-slate-900 border ${errorMsg ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-emerald-500'} text-white rounded-xl py-4 pl-12 pr-4 shadow-lg focus:ring-2 focus:outline-none transition-all placeholder:text-slate-500`}
                   />
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><SearchIcon /></div>
                   <button 
                      type="submit"
                      disabled={loadingState === LoadingState.SEARCHING || loadingState === LoadingState.ANALYZING}
                      className="absolute right-3 top-3 bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg disabled:opacity-50 transition-colors"
                   >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.5a.75.75 0 0 1 0 1.08l-5.5 5.5a.75.75 0 1 1-1.04-1.08l4.158-4.17H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                      </svg>
                   </button>
                 </form>

                 {/* Loading & Error */}
                 {(loadingState === LoadingState.SEARCHING || loadingState === LoadingState.ANALYZING) && <LoadingSpinner />}
                 
                 {loadingState === LoadingState.ERROR && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-xl flex flex-col items-center justify-center text-center mb-6 animate-fade-in">
                        <div className="bg-rose-500/20 p-3 rounded-full mb-3 text-rose-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                          </svg>
                        </div>
                        <h3 className="text-rose-400 font-bold text-lg mb-1">输入错误</h3>
                        <p className="text-slate-400 text-sm max-w-md">{errorMsg}</p>
                    </div>
                 )}

                 {/* Report Display */}
                 {loadingState !== LoadingState.ANALYZING && report && (
                    <div className="animate-fade-in space-y-6">
                       <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                             {report.stockName}
                          </h2>
                          <div className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/20">
                             {report.stockName.includes('示例') ? '模拟演示' : 'AI 分析完成'}
                          </div>
                       </div>

                       {/* Metrics */}
                       {report.keyMetrics && <MetricsGrid metrics={report.keyMetrics} />}

                       {/* Chart */}
                       {report.chartData && report.chartData.length > 0 && (
                          <StockChart 
                             data={report.chartData} 
                             markers={report.chartMarkers || []} 
                             patterns={report.chartPatterns || []}
                             stockName={report.stockName} 
                             supportPrice={report.keyMetrics?.supportPrice}
                             resistancePrice={report.keyMetrics?.resistancePrice}
                          />
                       )}
                       
                       {/* Report Text */}
                       <div className="bg-slate-900/50 p-4 md:p-6 rounded-2xl border border-slate-800">
                           <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                              <span className="text-emerald-500">📝</span> 深度分析详情
                           </h3>
                           <div className="prose prose-invert prose-sm max-w-none">
                               <MarkdownViewer content={report.markdownContent} />
                           </div>
                       </div>
                    </div>
                 )}
              </div>
            )}
            
            {/* TAB 3: Learning Module */}
            {activeTab === 'learning' && (
              <PatternLearning />
            )}

            {/* TAB 4: Profile */}
            {activeTab === 'profile' && (
              <Profile user={user} onLogout={handleLogout} />
            )}

          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden flex-shrink-0 bg-slate-900 border-t border-slate-800 flex justify-around items-center h-16 safe-area-bottom z-30">
           <button onClick={() => setActiveTab('trends')} className={`flex flex-col items-center gap-1 ${activeTab === 'trends' ? 'text-emerald-500' : 'text-slate-500'}`}>
              <span className="text-xl">📡</span>
              <span className="text-[10px]">风向标</span>
           </button>
           <button onClick={() => setActiveTab('analysis')} className={`flex flex-col items-center gap-1 ${activeTab === 'analysis' ? 'text-emerald-500' : 'text-slate-500'}`}>
              <span className="text-xl">📈</span>
              <span className="text-[10px]">智能分析</span>
           </button>
           <button onClick={() => setActiveTab('learning')} className={`flex flex-col items-center gap-1 ${activeTab === 'learning' ? 'text-emerald-500' : 'text-slate-500'}`}>
              <span className="text-xl">🎓</span>
              <span className="text-[10px]">学堂</span>
           </button>
           <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-emerald-500' : 'text-slate-500'}`}>
              <span className="text-xl">👤</span>
              <span className="text-[10px]">我的</span>
           </button>
        </div>

      </div>
    </div>
  );
};

export default App;
