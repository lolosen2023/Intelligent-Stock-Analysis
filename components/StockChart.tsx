
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, Time, LineStyle } from 'lightweight-charts';
import { ChartDataPoint, ChartMarker, ChartPattern } from '../types';
import { calculateMACD, calculateKDJ, calculateSMA, detectChartPatterns } from '../utils/technicalIndicators';

interface StockChartProps {
  data: ChartDataPoint[];
  markers: ChartMarker[];
  patterns?: ChartPattern[]; 
  stockName: string;
  supportPrice?: number;
  resistancePrice?: number;
}

export const StockChart: React.FC<StockChartProps> = ({ data, markers, patterns = [], stockName, supportPrice, resistancePrice }) => {
  const mainChartContainerRef = useRef<HTMLDivElement>(null);
  const macdChartContainerRef = useRef<HTMLDivElement>(null);
  const kdjChartContainerRef = useRef<HTMLDivElement>(null);

  const mainChartRef = useRef<IChartApi | null>(null);
  const macdChartRef = useRef<IChartApi | null>(null);
  const kdjChartRef = useRef<IChartApi | null>(null);

  // Debounce ref for pattern detection
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Sync lock
  const isSyncing = useRef(false);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // --- Prepare Data ---
    // Ensure chronological order
    const sortedData = [...data].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    // Remove duplicates
    const uniqueData = sortedData.filter((v, i, a) => i === a.findIndex(t => t.time === v.time));
    
    // Helper to convert date string to UNIX timestamp (seconds)
    const toTimestamp = (dateStr: string): Time => Math.floor(new Date(dateStr).getTime() / 1000) as Time;

    // Convert data to format with timestamp
    const chartData = uniqueData.map(d => ({
        ...d,
        originalTime: d.time,
        time: toTimestamp(d.time)
    }));
    
    const closePrices = chartData.map(d => d.close);
    const highPrices = chartData.map(d => d.high);
    const lowPrices = chartData.map(d => d.low);

    // Calculate Indicators
    const ma5 = calculateSMA(closePrices, 5);
    const ma10 = calculateSMA(closePrices, 10);
    const ma20 = calculateSMA(closePrices, 20);
    const macdData = calculateMACD(closePrices);
    const kdjData = calculateKDJ(closePrices, highPrices, lowPrices);

    // --- Process Pattern Highlighting ---
    const processedCandleData = chartData.map(d => {
      // Use timestamp for comparison (seconds * 1000 = ms)
      const dTimeMs = (d.time as number) * 1000;
      
      let colorOverride = undefined;
      let wickColorOverride = undefined;
      
      const pattern = patterns.find(p => {
        const start = new Date(p.startDate).getTime();
        const end = new Date(p.endDate).getTime();
        return dTimeMs >= start && dTimeMs <= end;
      });

      if (pattern) {
        if (pattern.type === 'Bullish') {
          colorOverride = '#ef4444'; // Red (Bullish)
          wickColorOverride = '#ef4444';
        } else if (pattern.type === 'Bearish') {
          colorOverride = '#10b981'; // Green (Bearish)
          wickColorOverride = '#10b981';
        } else {
          colorOverride = '#3b82f6'; // Blue
          wickColorOverride = '#3b82f6';
        }
      }

      const dataPoint: any = {
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      };

      if (colorOverride) {
        dataPoint.color = colorOverride;
        dataPoint.wickColor = wickColorOverride;
        dataPoint.borderColor = colorOverride;
      }

      return dataPoint;
    });

    // Common Chart Options
    const commonOptions = {
      layout: { background: { type: ColorType.Solid, color: '#0f172a' }, textColor: '#94a3b8' },
      grid: { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
      timeScale: { 
        borderColor: '#334155', 
        timeVisible: true, 
        rightOffset: 12, 
        barSpacing: 8,
        tickMarkFormatter: (time: number | string) => {
            // Since we converted everything to number, this should always be number
            if (typeof time === 'number') {
                const date = new Date(time * 1000);
                const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                const day = date.getUTCDate().toString().padStart(2, '0');
                return `${month}-${day}`;
            }
            return String(time);
        }
      },
      crosshair: { vertLine: { labelVisible: false, style: LineStyle.Dashed }, horzLine: { labelVisible: true, style: LineStyle.Dashed } },
      localization: { locale: 'zh-CN' }
    };

    let candleSeries: any;

    // 1. Main Chart
    if (mainChartContainerRef.current) {
      const chart = createChart(mainChartContainerRef.current, {
        ...commonOptions,
        height: 320,
        rightPriceScale: { borderColor: '#334155', scaleMargins: { top: 0.1, bottom: 0.2 } },
      });
      mainChartRef.current = chart;
      const vChart = chart as any;

      // Volume Overlay (Using v4 API) - Red Up, Green Down
      const volumeSeries = vChart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: { type: 'volume' },
        priceScaleId: '', 
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      volumeSeries.setData(chartData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)', // Red for Up, Green for Down
      })));

      // MA Lines (Using v4 API)
      const ma5Series = vChart.addLineSeries({ color: '#fbbf24', lineWidth: 1, title: 'MA5' });
      const ma10Series = vChart.addLineSeries({ color: '#60a5fa', lineWidth: 1, title: 'MA10' });
      const ma20Series = vChart.addLineSeries({ color: '#c084fc', lineWidth: 1, title: 'MA20' });

      ma5Series.setData(chartData.map((d, i) => ({ time: d.time, value: ma5[i] })).filter(d => !isNaN(d.value)));
      ma10Series.setData(chartData.map((d, i) => ({ time: d.time, value: ma10[i] })).filter(d => !isNaN(d.value)));
      ma20Series.setData(chartData.map((d, i) => ({ time: d.time, value: ma20[i] })).filter(d => !isNaN(d.value)));

      // Candlestick (Using v4 API) - Red Up, Green Down
      candleSeries = vChart.addCandlestickSeries({
        upColor: '#ef4444', downColor: '#10b981', borderVisible: false, wickUpColor: '#ef4444', wickDownColor: '#10b981'
      });
      candleSeries.setData(processedCandleData);

      // Support/Resistance Lines
      if (supportPrice) {
          candleSeries.createPriceLine({
              price: supportPrice,
              color: '#ef4444', // Support implies buying/up -> Red
              lineWidth: 1,
              lineStyle: LineStyle.Dashed,
              axisLabelVisible: true,
              title: '强支撑',
          });
      }
      if (resistancePrice) {
          candleSeries.createPriceLine({
              price: resistancePrice,
              color: '#10b981', // Resistance implies selling/down -> Green
              lineWidth: 1,
              lineStyle: LineStyle.Dashed,
              axisLabelVisible: true,
              title: '强压力',
          });
      }

      // --- Enhanced Marker Logic ---
      const updateMarkers = () => {
         const timeScale = chart.timeScale();
         const logicalRange = timeScale.getVisibleLogicalRange();
         if (!logicalRange) return;

         const end = Math.min(uniqueData.length - 1, Math.ceil(logicalRange.to) + 5);
         const start = Math.max(0, Math.floor(logicalRange.from) - 50);
         const visibleContextSlice = uniqueData.slice(start, end + 1);

         const dynamicPatterns = detectChartPatterns(visibleContextSlice);

         // Helper: convert marker time string to number
         const toMarkerTime = (t: string) => toTimestamp(t);

         // AI Markers from props
         const aiMarkers = (markers || []).map(m => ({
             ...m,
             time: toMarkerTime(m.time),
             size: 2, 
             shape: m.shape || 'arrowUp', 
             text: `🤖 ${m.text}`
         }));
         
         // Pattern Start/End Markers
         const patternMarkers: ChartMarker[] = [];
         patterns.forEach(p => {
             // Add marker at end date if it exists in data
             if (uniqueData.some(d => d.time === p.endDate)) {
                 patternMarkers.push({
                     time: p.endDate,
                     position: 'aboveBar',
                     color: p.type === 'Bullish' ? '#ef4444' : p.type === 'Bearish' ? '#10b981' : '#3b82f6',
                     shape: 'arrowDown',
                     text: `🔍 ${p.name}`
                 });
             }
         });
         
         // Convert pattern markers to numeric time
         const numericPatternMarkers = patternMarkers.map(m => ({
             ...m,
             time: toMarkerTime(m.time)
         }));

         // Convert dynamic pattern markers to numeric time
         const numericDynamicPatterns = dynamicPatterns.map(m => ({
             ...m,
             time: toMarkerTime(m.time)
         }));

         // Combine all
         const combinedMarkers = [...aiMarkers, ...numericPatternMarkers, ...numericDynamicPatterns];
         
         // Dedup
         const uniqueMarkersMap = new Map();
         combinedMarkers.forEach(m => {
             const key = `${m.time}-${m.text}`;
             if (!uniqueMarkersMap.has(key)) {
                 uniqueMarkersMap.set(key, m);
             }
         });
         
         // Filter to ensure marker time exists in chartData
         const finalMarkers = Array.from(uniqueMarkersMap.values())
             .filter(m => chartData.some(d => d.time === m.time)) 
             .sort((a, b) => (a.time as number) - (b.time as number));

         candleSeries.setMarkers(finalMarkers);
      };

      chart.timeScale().subscribeVisibleLogicalRangeChange(() => {
          if (timeoutId.current) clearTimeout(timeoutId.current);
          timeoutId.current = setTimeout(updateMarkers, 50);
      });
      
      setTimeout(updateMarkers, 100);
    }

    // 2. MACD & 3. KDJ Setup (Using v4 API)
    if (macdChartContainerRef.current) {
      const chart = createChart(macdChartContainerRef.current, { ...commonOptions, height: 100, layout: { ...commonOptions.layout, attributionLogo: false } });
      macdChartRef.current = chart;
      const mChart = chart as any;
      const difSeries = mChart.addLineSeries({ color: '#fbbf24', lineWidth: 1 });
      const deaSeries = mChart.addLineSeries({ color: '#60a5fa', lineWidth: 1 });
      const histSeries = mChart.addHistogramSeries({ color: '#10b981' });
      const macdChartData = chartData.map((d, i) => ({ time: d.time, dif: macdData.dif[i], dea: macdData.dea[i], hist: macdData.histogram[i] }));
      difSeries.setData(macdChartData.map(d => ({ time: d.time, value: d.dif })).filter(d => !isNaN(d.value)));
      deaSeries.setData(macdChartData.map(d => ({ time: d.time, value: d.dea })).filter(d => !isNaN(d.value)));
      histSeries.setData(macdChartData.map(d => ({ time: d.time, value: d.hist, color: d.hist >= 0 ? '#ef4444' : '#10b981' })).filter(d => !isNaN(d.value))); // Hist: Red Up, Green Down
    }

    if (kdjChartContainerRef.current) {
      const chart = createChart(kdjChartContainerRef.current, { ...commonOptions, height: 100, layout: { ...commonOptions.layout, attributionLogo: false } });
      kdjChartRef.current = chart;
      const kChart = chart as any;
      const kSeries = kChart.addLineSeries({ color: '#fbbf24', lineWidth: 1 });
      const dSeries = kChart.addLineSeries({ color: '#60a5fa', lineWidth: 1 });
      const jSeries = kChart.addLineSeries({ color: '#e879f9', lineWidth: 1 });
      kSeries.setData(chartData.map((d, i) => ({ time: d.time, value: kdjData.k[i] })).filter(d => !isNaN(d.value)));
      dSeries.setData(chartData.map((d, i) => ({ time: d.time, value: kdjData.d[i] })).filter(d => !isNaN(d.value)));
      jSeries.setData(chartData.map((d, i) => ({ time: d.time, value: kdjData.j[i] })).filter(d => !isNaN(d.value)));
    }

    // Sync
    const charts = [mainChartRef.current, macdChartRef.current, kdjChartRef.current].filter(Boolean) as IChartApi[];
    const syncCharts = (sourceChart: IChartApi) => {
        if (isSyncing.current) return;
        const range = sourceChart.timeScale().getVisibleLogicalRange();
        if (range) {
            isSyncing.current = true;
            charts.forEach(c => { if (c !== sourceChart) c.timeScale().setVisibleLogicalRange(range); });
            requestAnimationFrame(() => { isSyncing.current = false; });
        }
    };
    charts.forEach(chart => chart.timeScale().subscribeVisibleLogicalRangeChange(() => syncCharts(chart)));

    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      charts.forEach(c => c.remove());
    };
  }, [data, markers, patterns, supportPrice, resistancePrice]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-0 shadow-lg mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-slate-800/50 border-b border-slate-800">
         <h3 className="text-white font-bold flex items-center gap-2 text-sm md:text-base">
            <span className="text-emerald-500">📈</span> 
            {stockName} <span className="text-slate-500 font-normal text-xs ml-1">日K (6个月)</span>
         </h3>
         <div className="flex gap-2 text-[10px] md:text-xs font-mono">
            <span className="text-amber-400">MA5</span>
            <span className="text-blue-400">MA10</span>
            <span className="text-purple-400">MA20</span>
         </div>
      </div>
      
      {/* Main Chart Area */}
      <div className="flex flex-col">
        <div ref={mainChartContainerRef} className="w-full" />
        <div className="relative border-t border-slate-800/50 bg-slate-900">
           <span className="absolute left-1 top-0.5 text-[9px] text-slate-500 z-10 font-mono select-none">MACD(12,26,9)</span>
           <div ref={macdChartContainerRef} className="w-full" />
        </div>
        <div className="relative border-t border-slate-800/50 bg-slate-900">
           <span className="absolute left-1 top-0.5 text-[9px] text-slate-500 z-10 font-mono select-none">KDJ(9,3,3)</span>
           <div ref={kdjChartContainerRef} className="w-full" />
        </div>
      </div>

      <div className="bg-slate-950/50 p-2 text-center border-t border-slate-800">
        <p className="text-[10px] text-slate-500 italic flex items-center justify-center gap-2 flex-wrap">
           <span className="flex items-center"><span className="w-2 h-0.5 bg-rose-500 mr-1"></span> 支撑位</span>
           <span className="flex items-center"><span className="w-2 h-0.5 bg-emerald-500 mr-1"></span> 压力位</span>
           <span className="ml-2 flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-1"></span> 看涨形态</span>
           <span className="ml-2 flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> 看跌形态</span>
        </p>
      </div>
    </div>
  );
};
