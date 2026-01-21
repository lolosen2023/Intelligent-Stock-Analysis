
import React from 'react';

interface TechnicalPatternsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalPatternsModal: React.FC<TechnicalPatternsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
            <span className="text-emerald-500">📖</span> 技术形态图解百科
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 经典反转形态 */}
            <div className="space-y-4">
              <h4 className="text-amber-400 font-bold flex items-center gap-2">
                <span>🔄</span> 经典反转形态 (Reversal)
              </h4>
              
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-rose-500/30 transition-colors">
                <p className="font-bold text-slate-200 text-base">双底 (Double Bottom / W底)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">股价在相似低点两次止跌，形成W形状。意味着空头力量衰竭，颈线突破是强烈的反转买入信号。</p>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-emerald-500/30 transition-colors">
                <p className="font-bold text-slate-200 text-base">双顶 (Double Top / M头)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">股价两次冲击同一高点失败，形成M形状。意味着上涨动能耗尽，主力出货，后市看跌。</p>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-rose-500/30 transition-colors">
                <p className="font-bold text-slate-200 text-base">头肩底 (Inv. Head & Shoulders)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">中间低点（头）比两侧（肩）更低。这是一种经典的底部反转形态，预示着长期下跌趋势的终结。</p>
              </div>

               <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-emerald-500/30 transition-colors">
                <p className="font-bold text-slate-200 text-base">头肩顶 (Head & Shoulders)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">中间高点（头）比两侧（肩）更高。这是最可靠的顶部反转形态之一，跌破颈线通常意味着大跌开始。</p>
              </div>
            </div>

            {/* 中继整理形态 */}
            <div className="space-y-4">
              <h4 className="text-blue-400 font-bold flex items-center gap-2">
                <span>📐</span> 中继整理形态 (Continuation)
              </h4>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                <p className="font-bold text-slate-200 text-base">上升三角形 (Ascending Triangle)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">高点基本持平（压力），低点不断抬高（支撑）。多头买气强劲，通常预示向上突破。</p>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                <p className="font-bold text-slate-200 text-base">下降三角形 (Descending Triangle)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">低点基本持平（支撑），高点不断降低（压力）。空头力量增强，通常预示向下破位。</p>
              </div>

               <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                <p className="font-bold text-slate-200 text-base">对称三角形 (Symmetrical Triangle)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">高点降低，低点抬高，股价波幅收敛。市场处于决战前夕，突破方向取决于主力资金流向。</p>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                <p className="font-bold text-slate-200 text-base">旗形 (Flag)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">急速涨跌后出现的平行通道整理。通常整理结束后，股价会延续之前的趋势方向（空中加油）。</p>
              </div>
            </div>

            {/* 指标信号 */}
            <div className="space-y-4 md:col-span-2">
               <h4 className="text-purple-400 font-bold flex items-center gap-2">
                <span>📊</span> 核心指标信号 (Indicators)
              </h4>
               <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-purple-500/30 transition-colors">
                    <p className="font-bold text-slate-200 text-base">金叉/死叉 (Crossover)</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">短期均线上穿长期均线为金叉（看多）；反之为死叉（看空）。MACD同理。</p>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-purple-500/30 transition-colors">
                    <p className="font-bold text-slate-200 text-base">顶背离/底背离 (Divergence)</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">股价创新高指标不创新高（顶背离-跌）；股价创新低指标不创新低（底背离-涨）。</p>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-purple-500/30 transition-colors">
                    <p className="font-bold text-slate-200 text-base">上升楔形/下降楔形 (Wedge)</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">上升楔形通常是见顶信号（诱多）；下降楔形通常是见底信号（主力吸筹）。</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 flex gap-3 items-start">
             <span className="text-xl">💡</span>
             <div className="text-xs text-blue-300">
                <p className="font-bold mb-1">使用小贴士：</p>
                <ul className="list-disc ml-4 space-y-1 text-slate-400">
                  <li>形态的有效性通常需要<strong>成交量</strong>的配合（如底部放量，顶部缩量滞涨）。</li>
                  <li>三角形突破通常发生在形态的 2/3 至 3/4 处，过早或过晚突破有效性降低。</li>
                  <li>AI 识别的形态仅供参考，实盘操作请务必设置止损位。</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
