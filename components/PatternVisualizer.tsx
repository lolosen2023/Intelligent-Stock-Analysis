
import React from 'react';

interface PatternVisualizerProps {
  type: string;
  className?: string;
}

export const PatternVisualizer: React.FC<PatternVisualizerProps> = ({ type, className = "w-full h-48" }) => {
  // Common styles - CHINESE MARKET STANDARD (Red Up, Green Down)
  const strokeWidth = 2;
  const bullishColor = "#ef4444"; // Rose 500 (Red for Up)
  const bearishColor = "#10b981"; // Emerald 500 (Green for Down)
  const neutralColor = "#64748b"; // Slate 500
  const gridColor = "#1e293b"; // Slate 800

  // Helper for candles with animation class
  const Candle = ({ x, open, close, high, low, color, width = 6, delayClass = "" }: any) => (
    <g className={delayClass}>
      <line x1={x} y1={high} x2={x} y2={low} stroke={color} strokeWidth="1" />
      <rect x={x - width/2} y={Math.min(open, close)} width={width} height={Math.abs(open - close)} fill={color} />
    </g>
  );

  const renderPattern = () => {
    switch (type) {
      // --- REAL WORLD EXAMPLES (CASE STUDIES) ---
      case 'real_hammer': // 茅台 2018 (Hammer)
        return (
          <>
            <text x="50" y="10" fill="#94a3b8" fontSize="6" textAnchor="middle">茅台 2018底走势模拟</text>
            {/* Down Trend */}
            <Candle x={10} open={20} close={30} high={18} low={32} color={bearishColor} width={4} />
            <Candle x={20} open={30} close={50} high={28} low={52} color={bearishColor} width={4} />
            <Candle x={30} open={50} close={70} high={48} low={72} color={bearishColor} width={4} />
            {/* The Hammer */}
            <Candle x={45} open={72} close={76} high={72} low={95} color={bullishColor} width={6} delayClass="animate-candle-1" />
            <text x="45" y="65" fill={bullishColor} fontSize="8" textAnchor="middle">🔨</text>
            {/* Reversal */}
            <Candle x={60} open={76} close={60} high={58} low={78} color={bullishColor} width={4} delayClass="animate-candle-2" />
            <Candle x={70} open={60} close={40} high={38} low={62} color={bullishColor} width={4} delayClass="animate-candle-3" />
            <Candle x={80} open={40} close={25} high={22} low={42} color={bullishColor} width={4} />
            {/* Trend Line */}
            <path d="M10,25 L40,80 L80,25" fill="none" stroke={neutralColor} strokeWidth="0.5" strokeDasharray="2" />
          </>
        );
      case 'real_shooting_star': // 中信 2020 (Shooting Star)
        return (
          <>
             <text x="50" y="90" fill="#94a3b8" fontSize="6" textAnchor="middle">中信证券 2020顶走势模拟</text>
             {/* Up Trend */}
             <Candle x={10} open={80} close={70} high={68} low={82} color={bullishColor} width={4} />
             <Candle x={20} open={70} close={50} high={48} low={72} color={bullishColor} width={4} />
             <Candle x={30} open={50} close={30} high={28} low={52} color={bullishColor} width={4} />
             {/* Shooting Star */}
             <Candle x={50} open={25} close={28} high={5} low={30} color={bearishColor} width={6} delayClass="animate-candle-1" />
             <text x="50" y="40" fill={bearishColor} fontSize="8" textAnchor="middle">⭐</text>
             {/* Crash */}
             <Candle x={65} open={28} close={50} high={25} low={52} color={bearishColor} width={4} delayClass="animate-candle-2" />
             <Candle x={75} open={50} close={70} high={48} low={72} color={bearishColor} width={4} delayClass="animate-candle-3" />
             <Candle x={85} open={70} close={85} high={68} low={88} color={bearishColor} width={4} />
          </>
        );
      case 'real_engulfing_bull': // 比亚迪 2021 (Bullish Engulfing)
        return (
           <>
             <text x="50" y="10" fill="#94a3b8" fontSize="6" textAnchor="middle">比亚迪 2021底走势模拟</text>
             {/* Consolidation/Drop */}
             <Candle x={10} open={50} close={55} high={48} low={58} color={bearishColor} width={4} />
             <Candle x={20} open={55} close={60} high={52} low={62} color={bearishColor} width={4} />
             {/* Small Red */}
             <Candle x={35} open={60} close={65} high={58} low={68} color={bearishColor} width={5} />
             {/* Big Green Engulfing */}
             <Candle x={50} open={68} close={40} high={38} low={70} color={bullishColor} width={8} delayClass="animate-candle-1" />
             <rect x="30" y="38" width="40" height="35" fill="none" stroke={bullishColor} strokeWidth="0.5" strokeDasharray="2" />
             {/* Rally */}
             <Candle x={65} open={40} close={30} high={28} low={42} color={bullishColor} width={4} delayClass="animate-candle-2" />
             <Candle x={75} open={30} close={20} high={18} low={32} color={bullishColor} width={4} delayClass="animate-candle-3" />
             <path d="M50,70 L80,20" fill="none" stroke={bullishColor} strokeWidth="1" />
           </>
        );
      case 'real_engulfing_bear': // 宁德时代 2021 (Bearish Engulfing)
         return (
            <>
               <text x="50" y="90" fill="#94a3b8" fontSize="6" textAnchor="middle">宁德时代 2021顶走势模拟</text>
               {/* Rally */}
               <Candle x={10} open={60} close={50} high={48} low={62} color={bullishColor} width={4} />
               <Candle x={25} open={50} close={40} high={38} low={52} color={bullishColor} width={4} />
               {/* Small Green */}
               <Candle x={40} open={40} close={35} high={32} low={42} color={bullishColor} width={5} />
               {/* Big Red Engulfing */}
               <Candle x={55} open={32} close={65} high={30} low={68} color={bearishColor} width={8} delayClass="animate-candle-1" />
               {/* Drop */}
               <Candle x={70} open={65} close={75} high={62} low={78} color={bearishColor} width={4} delayClass="animate-candle-2" />
               <Candle x={85} open={75} close={85} high={72} low={88} color={bearishColor} width={4} delayClass="animate-candle-3" />
            </>
         );
       case 'real_morning_star': // 东方财富 (Morning Star)
          return (
             <>
                <text x="50" y="10" fill="#94a3b8" fontSize="6" textAnchor="middle">东方财富 2019底走势模拟</text>
                <Candle x={20} open={30} close={70} high={25} low={75} color={bearishColor} width={8} />
                <Candle x={50} open={80} close={85} high={75} low={88} color={neutralColor} width={6} delayClass="animate-candle-1" />
                <Candle x={80} open={75} close={35} high={30} low={78} color={bullishColor} width={8} delayClass="animate-candle-2" />
                <path d="M20,80 L50,90 L80,80" fill="none" stroke={neutralColor} strokeWidth="0.5" strokeDasharray="2" />
             </>
          );
       case 'real_head_shoulders': // 上证 6124 (Head Shoulders)
          return (
             <>
               <text x="50" y="95" fill="#94a3b8" fontSize="6" textAnchor="middle">上证指数 6124顶走势模拟</text>
               <path d="M10,80 L25,40 L40,65 L55,10 L70,65 L85,40 L95,90" fill="none" stroke={bearishColor} strokeWidth="1.5" />
               <line x1="10" y1="65" x2="95" y2="65" stroke={neutralColor} strokeDasharray="2" />
               <circle cx="55" cy="10" r="2" fill={bearishColor} />
               <text x="55" y="25" fill={bearishColor} fontSize="6" textAnchor="middle">6124</text>
             </>
          );
        case 'real_old_duck': // 山东黄金 (Old Duck)
           return (
             <>
                <text x="50" y="95" fill="#94a3b8" fontSize="6" textAnchor="middle">山东黄金 主升浪模拟</text>
                {/* Price */}
                <path d="M10,80 Q30,30 50,50 T90,10" fill="none" stroke={bullishColor} strokeWidth="2" className="animate-draw" />
                {/* MA Lines */}
                <path d="M10,85 Q30,35 50,55 T90,15" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2" />
                <path d="M10,90 Q35,50 55,70 T90,25" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2" />
                <circle cx="80" cy="20" r="3" fill="none" stroke={bullishColor} />
             </>
           );

      // --- 1. K-Line Combinations ---
      case 'hammer': // 锤头线/吊颈线
        return (
          <>
            <path d="M10,20 L30,50" stroke={neutralColor} strokeDasharray="2" />
            <Candle x={50} open={40} close={45} high={40} low={80} color={bullishColor} width={10} delayClass="animate-candle-1" />
            <text x="50" y="90" fill={neutralColor} fontSize="8" textAnchor="middle">长下影线 (实体2倍以上)</text>
            <text x="80" y="40" fill={bullishColor} fontSize="8">底部: 锤头线</text>
            <text x="80" y="50" fill={bearishColor} fontSize="8">顶部: 吊颈线</text>
          </>
        );
      case 'shooting_star': // 倒锤头/射击之星
        return (
          <>
            <path d="M10,80 L30,50" stroke={neutralColor} strokeDasharray="2" />
            <Candle x={50} open={75} close={80} high={40} low={80} color={bearishColor} width={10} delayClass="animate-candle-1" />
            <text x="50" y="30" fill={neutralColor} fontSize="8" textAnchor="middle">长上影线 (抛压)</text>
            <text x="80" y="70" fill={bullishColor} fontSize="8">底部: 倒锤头</text>
            <text x="80" y="80" fill={bearishColor} fontSize="8">顶部: 射击之星</text>
          </>
        );
      case 'piercing_line': // 曙光初现 (底部)
        return (
           <>
             <Candle x={30} open={30} close={70} high={25} low={75} color={bearishColor} width={12} delayClass="animate-candle-1" />
             <Candle x={50} open={80} close={45} high={40} low={82} color={bullishColor} width={12} delayClass="animate-candle-2" />
             <line x1={10} y1={50} x2={90} y2={50} stroke={neutralColor} strokeDasharray="2" strokeWidth="0.5" />
             <text x="75" y="50" fill={neutralColor} fontSize="6">50%中轴</text>
             <text x="50" y="90" fill={bullishColor} fontSize="8" textAnchor="middle">深入阴线实体1/2以上</text>
           </>
        );
      case 'dark_cloud': // 乌云盖顶 (顶部)
        return (
           <>
             <Candle x={30} open={70} close={30} high={25} low={75} color={bullishColor} width={12} delayClass="animate-candle-1" />
             <Candle x={50} open={20} close={55} high={15} low={58} color={bearishColor} width={12} delayClass="animate-candle-2" />
             <line x1={10} y1={50} x2={90} y2={50} stroke={neutralColor} strokeDasharray="2" strokeWidth="0.5" />
             <text x="75" y="50" fill={neutralColor} fontSize="6">50%中轴</text>
             <text x="50" y="90" fill={bearishColor} fontSize="8" textAnchor="middle">切入阳线实体1/2以下</text>
           </>
        );
      case 'tweezer': // 平顶/平底
        return (
           <>
              <Candle x={30} open={70} close={30} high={30} low={75} color={bullishColor} width={10} delayClass="animate-candle-1" />
              <Candle x={50} open={30} close={60} high={30} low={65} color={bearishColor} width={10} delayClass="animate-candle-2" />
              <line x1={20} y1={30} x2={60} y2={30} stroke={neutralColor} strokeWidth="1" />
              <text x="80" y="30" fill={neutralColor} fontSize="8">最高价一致</text>
              <text x="50" y="90" fill={neutralColor} fontSize="8" textAnchor="middle">短期阻力/支撑</text>
           </>
        );
      case 'sandwich_bull': // 两阳夹一阴 (多方炮)
        return (
           <>
             <Candle x={30} open={70} close={40} high={35} low={75} color={bullishColor} width={10} delayClass="animate-candle-1" />
             <Candle x={50} open={45} close={55} high={42} low={58} color={bearishColor} width={10} delayClass="animate-candle-2" />
             <Candle x={70} open={50} close={20} high={15} low={55} color={bullishColor} width={10} delayClass="animate-candle-3" />
             <path d="M20,80 L80,30" fill="none" stroke={bullishColor} strokeWidth="0.5" strokeDasharray="2" />
             <text x="50" y="90" fill={bullishColor} fontSize="8" textAnchor="middle">多方强势进攻</text>
           </>
        );
        
      // --- 2. Classic Reversal ---
      case 'head_shoulders_top': // 头肩顶
        return (
          <>
            <path d="M5,80 L20,35 L35,60 L50,10 L65,60 L80,35 L95,90" fill="none" stroke={bearishColor} strokeWidth={strokeWidth} className="animate-draw" />
            <line x1="5" y1="60" x2="95" y2="60" stroke={neutralColor} strokeDasharray="4" strokeWidth="1" />
            <text x="20" y="30" fill={neutralColor} fontSize="8" textAnchor="middle">左肩</text>
            <text x="50" y="8" fill={bearishColor} fontSize="8" textAnchor="middle">头</text>
            <text x="80" y="30" fill={neutralColor} fontSize="8" textAnchor="middle">右肩</text>
            <text x="85" y="65" fill={neutralColor} fontSize="8">颈线 (关键)</text>
            <circle cx="65" cy="60" r="2" fill={bearishColor} />
            <text x="65" y="70" fill={bearishColor} fontSize="6" textAnchor="middle">跌破点</text>
          </>
        );
      case 'triple_top': // 三重顶
        return (
           <>
             <path d="M10,80 L20,20 L35,60 L50,20 L65,60 L80,20 L90,80" fill="none" stroke={bearishColor} strokeWidth={strokeWidth} className="animate-draw" />
             <line x1="10" y1="20" x2="90" y2="20" stroke={neutralColor} strokeDasharray="2" />
             <line x1="10" y1="60" x2="90" y2="60" stroke={neutralColor} strokeWidth="1" />
             <rect x="30" y="58" width="30" height="4" fill={neutralColor} opacity="0.2" className="animate-area" />
             <text x="50" y="15" fill={bearishColor} fontSize="8" textAnchor="middle">三次遇阻</text>
             <text x="50" y="70" fill={neutralColor} fontSize="8" textAnchor="middle">颈线支撑位</text>
           </>
        );
      case 'v_reversal': // V形反转
        return (
           <>
             <path d="M10,20 L50,90 L90,10" fill="none" stroke={neutralColor} strokeWidth={strokeWidth} className="animate-draw" />
             <Candle x={45} open={70} close={85} high={65} low={90} color={bearishColor} width={6} delayClass="animate-candle-1" />
             <Candle x={55} open={85} close={60} high={55} low={90} color={bullishColor} width={6} delayClass="animate-candle-2" />
             <text x="50" y="50" fill={neutralColor} fontSize="8" textAnchor="middle">急速转换 (难把握)</text>
             <text x="50" y="95" fill={bullishColor} fontSize="8" textAnchor="middle">尖底</text>
           </>
        );
      case 'island_reversal': // 岛形反转
        return (
           <>
             {/* Left trend */}
             <Candle x={20} open={40} close={30} high={25} low={45} color={bullishColor} width={6} />
             {/* Gap Down */}
             <rect x="25" y="45" width="20" height="15" fill={neutralColor} opacity="0.1" className="animate-area" />
             <text x="35" y="55" fill={neutralColor} fontSize="6" textAnchor="middle">缺口</text>
             {/* Island */}
             <Candle x={40} open={65} close={70} high={60} low={75} color={bearishColor} width={6} delayClass="animate-candle-1" />
             <Candle x={50} open={70} close={72} high={68} low={78} color={neutralColor} width={6} delayClass="animate-candle-2" />
             <Candle x={60} open={72} close={68} high={65} low={75} color={bearishColor} width={6} delayClass="animate-candle-3" />
             {/* Gap Up (Reversal) for Top Island (this is bottom island visualization actually) or Top.. let's do Top Island */}
             {/* Let's redraw as TOP Island for bearish example */}
             <rect x="0" y="0" width="100" height="100" fill="#0f172a" /> {/* Reset bg */}
             <Candle x={20} open={60} close={40} high={35} low={65} color={bullishColor} width={6} />
             {/* Gap Up */}
             <rect x="25" y="25" width="10" height="10" fill={neutralColor} opacity="0.1" className="animate-area"/>
             {/* Island Top */}
             <Candle x={40} open={20} close={25} high={15} low={28} color={neutralColor} width={6} delayClass="animate-candle-1" />
             <Candle x={50} open={24} close={22} high={18} low={26} color={neutralColor} width={6} delayClass="animate-candle-2" />
             {/* Gap Down */}
             <rect x="55" y="25" width="10" height="10" fill={neutralColor} opacity="0.1" className="animate-area"/>
             <Candle x={70} open={40} close={60} high={35} low={65} color={bearishColor} width={6} delayClass="animate-candle-3" />
             <text x="50" y="10" fill={bearishColor} fontSize="8" textAnchor="middle">孤岛 (情绪隔绝)</text>
           </>
        );

      // --- 3. Continuation ---
      case 'flag': // 旗形
        return (
          <>
            <path d="M10,90 L30,20" fill="none" stroke={bullishColor} strokeWidth={strokeWidth} /> {/* Pole */}
            <path d="M30,20 L40,40 L50,25 L60,45 L70,30" fill="none" stroke={neutralColor} strokeWidth="1" /> {/* Flag channel */}
            <rect x="30" y="20" width="40" height="30" transform="rotate(10 50 35)" fill={neutralColor} opacity="0.1" className="animate-area" />
            <line x1="30" y1="20" x2="70" y2="30" stroke={neutralColor} strokeDasharray="2" />
            <line x1="40" y1="40" x2="80" y2="50" stroke={neutralColor} strokeDasharray="2" />
             <path d="M70,30 L90,5" fill="none" stroke={bullishColor} strokeWidth={strokeWidth} markerEnd="url(#arrow)" className="animate-draw" /> 
            <text x="20" y="60" fill={bullishColor} fontSize="8" textAnchor="middle">旗杆</text>
            <text x="55" y="55" fill={neutralColor} fontSize="8" textAnchor="middle">整理区间</text>
          </>
        );
       case 'rectangle': // 矩形整理
        return (
          <>
            <path d="M10,40 L25,70 L40,40 L55,70 L70,40 L85,70 L95,30" fill="none" stroke={bullishColor} strokeWidth={strokeWidth} />
            <rect x="10" y="40" width="80" height="30" fill={neutralColor} opacity="0.1" className="animate-area" />
            <line x1="10" y1="40" x2="90" y2="40" stroke={neutralColor} strokeWidth="2" /> 
            <line x1="10" y1="70" x2="90" y2="70" stroke={neutralColor} strokeWidth="2" />
            <text x="50" y="35" fill={neutralColor} fontSize="8" textAnchor="middle">箱体压力</text>
            <text x="50" y="80" fill={neutralColor} fontSize="8" textAnchor="middle">箱体支撑</text>
          </>
        );
        
      // --- 4. Special/Composite ---
      case 'broadening': // 扩散形态 (喇叭形)
        return (
          <>
             <path d="M10,50 L30,40 L40,60 L60,30 L70,70 L90,20" fill="none" stroke={bearishColor} strokeWidth={strokeWidth} className="animate-draw" />
             <line x1="10" y1="50" x2="90" y2="10" stroke={neutralColor} strokeDasharray="2" /> {/* Top expanding */}
             <line x1="10" y1="50" x2="90" y2="90" stroke={neutralColor} strokeDasharray="2" /> {/* Bottom expanding */}
             <text x="50" y="90" fill={bearishColor} fontSize="8" textAnchor="middle">情绪失控/波动加剧</text>
             <text x="50" y="10" fill={neutralColor} fontSize="8" textAnchor="middle">通常见顶</text>
          </>
        );
      case 'diamond': // 菱形 (钻石)
        return (
          <>
             <path d="M10,50 L30,20 L50,80 L70,20 L90,50" fill="none" stroke={bearishColor} strokeWidth={strokeWidth} className="animate-draw" />
             <line x1="10" y1="50" x2="50" y2="10" stroke={neutralColor} strokeDasharray="2" />
             <line x1="10" y1="50" x2="50" y2="90" stroke={neutralColor} strokeDasharray="2" />
             <line x1="50" y1="10" x2="90" y2="50" stroke={neutralColor} strokeDasharray="2" />
             <line x1="50" y1="90" x2="90" y2="50" stroke={neutralColor} strokeDasharray="2" />
             <text x="50" y="50" fill={neutralColor} fontSize="8" textAnchor="middle">多空分歧巨大</text>
          </>
        );
      case 'gap_theory': // 缺口理论
        return (
           <>
             <Candle x={20} open={60} close={40} high={35} low={65} color={bullishColor} width={8} />
             <rect x="20" y="25" width="20" height="10" fill={bullishColor} opacity="0.2" className="animate-area" />
             <text x="30" y="32" fill={bullishColor} fontSize="6" textAnchor="middle">普通缺口</text>
             
             <Candle x={40} open={25} close={15} high={10} low={28} color={bullishColor} width={8} delayClass="animate-candle-1" />
             <rect x="40" y="50" width="20" height="15" fill={bullishColor} opacity="0.3" className="animate-area" />
             <text x="50" y="60" fill={bullishColor} fontSize="6" textAnchor="middle">突破缺口</text>
             
             <Candle x={60} open={70} close={50} high={45} low={75} color={bullishColor} width={8} delayClass="animate-candle-2" />
             
             <Candle x={80} open={30} close={10} high={5} low={35} color={bullishColor} width={8} delayClass="animate-candle-3" />
             <text x="80" y="90" fill={neutralColor} fontSize="8" textAnchor="middle">动力强劲</text>
           </>
        );
      case 'old_duck_head': // 老鸭头 (New)
        return (
          <>
             {/* Price Curve: Rise, Round Head, Dip (Nostril), Rise (Bill) */}
             <path d="M10,80 Q30,20 50,40 T90,10" fill="none" stroke={bullishColor} strokeWidth="2" className="animate-draw" />
             
             {/* MA Lines (5 and 10) - Simulating the 'duck' shape formed by MA */}
             {/* MA5 Fast line following price closely */}
             <path d="M10,85 Q30,25 50,45 T90,15" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2" />
             {/* MA10 Slow line */}
             <path d="M10,90 Q35,40 55,60 T90,25" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2" />
             
             {/* Key Points */}
             <circle cx="35" cy="25" r="2" fill={bullishColor} />
             <text x="35" y="20" fill={bullishColor} fontSize="8" textAnchor="middle">鸭头顶</text>
             
             <circle cx="55" cy="50" r="2" fill={neutralColor} />
             <text x="55" y="75" fill={neutralColor} fontSize="8" textAnchor="middle">鸭鼻孔(量芝麻点)</text>
             
             <circle cx="85" cy="15" r="2" fill={bullishColor} />
             <text x="85" y="35" fill={bullishColor} fontSize="8" textAnchor="middle">鸭嘴张开</text>
          </>
        );

      // --- Fallbacks for previous types to ensure they still work or update them ---
      case 'double_bottom': // W底
        return (
          <>
            <path d="M10,20 L30,80 L50,50 L70,80 L90,10" fill="none" stroke={bullishColor} strokeWidth={strokeWidth} className="animate-draw" />
            <line x1="10" y1="50" x2="90" y2="50" stroke={neutralColor} strokeDasharray="4" strokeWidth="1" />
            <rect x="25" y="75" width="50" height="10" fill={bullishColor} opacity="0.1" className="animate-area" />
            <text x="50" y="45" fill={neutralColor} fontSize="8" textAnchor="middle">颈线 (Neckline)</text>
            <circle cx="30" cy="80" r="3" fill={bullishColor} />
            <circle cx="70" cy="80" r="3" fill={bullishColor} />
            <text x="30" y="95" fill={bullishColor} fontSize="8" textAnchor="middle">底1</text>
            <text x="70" y="95" fill={bullishColor} fontSize="8" textAnchor="middle">底2</text>
          </>
        );
      case 'cup_handle': // 杯柄形
        return (
          <>
             {/* Cup */}
             <path d="M10,20 Q10,80 50,80 Q90,80 90,40" fill="none" stroke={bullishColor} strokeWidth={strokeWidth} className="animate-draw" />
             {/* Handle */}
             <path d="M90,40 L95,60 L100,50" fill="none" stroke={bullishColor} strokeWidth={strokeWidth} />
             <line x1="10" y1="20" x2="90" y2="40" stroke={neutralColor} strokeDasharray="4" strokeWidth="1" />
             <text x="50" y="95" fill={bullishColor} fontSize="8" textAnchor="middle">圆弧底 (Cup)</text>
             <text x="95" y="70" fill={neutralColor} fontSize="8" textAnchor="middle">柄</text>
          </>
        );
       case 'bullish_engulfing': // 看涨吞没
          return (
            <>
              {/* Previous trend */}
              <path d="M10,30 L30,60" fill="none" stroke={neutralColor} strokeWidth="1" strokeDasharray="2" />
              {/* Small Red Candle */}
              <Candle x={40} open={60} close={70} high={55} low={75} color={bearishColor} width={10} delayClass="animate-candle-1" />
              {/* Large Green Candle Engulfing */}
              <Candle x={60} open={75} close={50} high={45} low={80} color={bullishColor} width={14} delayClass="animate-candle-2" />
              <rect x="52" y="50" width="16" height="25" fill={bullishColor} opacity="0.1" className="animate-area" />
              <text x="50" y="90" fill={bullishColor} fontSize="8" textAnchor="middle">完全包裹</text>
            </>
          );
      case 'bearish_engulfing': // 看跌吞没
          return (
             <>
               <path d="M10,70 L30,40" fill="none" stroke={neutralColor} strokeWidth="1" strokeDasharray="2" />
               <Candle x={40} open={40} close={30} high={25} low={45} color={bullishColor} width={10} delayClass="animate-candle-1" />
               <Candle x={60} open={25} close={50} high={20} low={55} color={bearishColor} width={14} delayClass="animate-candle-2" />
               <text x="50" y="90" fill={bearishColor} fontSize="8" textAnchor="middle">阴包阳</text>
             </>
          );
      case 'morning_star': // 早晨之星
          return (
             <>
               <Candle x={30} open={30} close={70} high={25} low={75} color={bearishColor} width={10} delayClass="animate-candle-1" />
               <Candle x={50} open={80} close={85} high={78} low={88} color={neutralColor} width={8} delayClass="animate-candle-2" />
               <Candle x={70} open={75} close={35} high={30} low={78} color={bullishColor} width={10} delayClass="animate-candle-3" />
               <text x="50" y="15" fill={bullishColor} fontSize="8" textAnchor="middle">启明星</text>
               <text x="50" y="95" fill={neutralColor} fontSize="8" textAnchor="middle">见底信号</text>
             </>
          );
      case 'three_white_soldiers': // 红三兵
        return (
           <>
             <path d="M10,80 L20,70" fill="none" stroke={neutralColor} strokeDasharray="2" />
             <Candle x={35} open={70} close={55} high={50} low={72} color={bullishColor} width={10} delayClass="animate-candle-1" />
             <Candle x={55} open={55} close={40} high={35} low={57} color={bullishColor} width={10} delayClass="animate-candle-2" />
             <Candle x={75} open={40} close={25} high={20} low={42} color={bullishColor} width={10} delayClass="animate-candle-3" />
             <line x1={30} y1={55} x2={80} y2={25} stroke={bullishColor} strokeWidth="0.5" strokeDasharray="2" />
             <text x="55" y="90" fill={bullishColor} fontSize="8" textAnchor="middle">重心上移</text>
           </>
        );
      case 'round_bottom': // 圆弧底
        return (
          <>
            <path d="M10,20 Q50,95 90,20" fill="none" stroke={bullishColor} strokeWidth={strokeWidth} className="animate-draw" />
            <line x1="10" y1="20" x2="90" y2="20" stroke={neutralColor} strokeDasharray="4" strokeWidth="1" />
            <rect x="30" y="60" width="40" height="30" fill={bullishColor} opacity="0.1" className="animate-area" />
            <text x="50" y="50" fill={bullishColor} fontSize="8" textAnchor="middle">缓慢吸筹</text>
            <text x="50" y="15" fill={neutralColor} fontSize="8" textAnchor="middle">颈线阻力</text>
          </>
        );
      default:
        return <text x="50" y="50" fill="white" textAnchor="middle">图示暂缺</text>;
    }
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={gridColor} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" opacity="0.5" />
        
        {renderPattern()}
      </svg>
    </div>
  );
};
