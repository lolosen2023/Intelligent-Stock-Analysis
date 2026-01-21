
import { ChartDataPoint, ChartMarker } from '../types';

// Simple Technical Indicator Calculator

export const calculateSMA = (data: number[], period: number): number[] => {
  const smaArray: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      // Not enough data for SMA
      smaArray.push(NaN); 
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j];
    }
    smaArray.push(sum / period);
  }
  return smaArray;
};

export const calculateEMA = (data: number[], period: number): number[] => {
  const k = 2 / (period + 1);
  const emaArray: number[] = [];
  
  // Initialize with SMA for the first point or just the first data point to keep it simple
  let ema = data[0];
  emaArray.push(ema);

  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    emaArray.push(ema);
  }
  return emaArray;
};

export const calculateMACD = (closePrices: number[]) => {
  if (closePrices.length < 26) return { dif: [], dea: [], histogram: [] };

  const ema12 = calculateEMA(closePrices, 12);
  const ema26 = calculateEMA(closePrices, 26);
  
  const dif = ema12.map((v, i) => v - ema26[i]);
  const dea = calculateEMA(dif, 9);
  const histogram = dif.map((v, i) => (v - dea[i]) * 2);

  return { dif, dea, histogram };
};

export const calculateKDJ = (close: number[], high: number[], low: number[]) => {
  let k = 50;
  let d = 50;
  const kValues: number[] = [];
  const dValues: number[] = [];
  const jValues: number[] = [];

  for (let i = 0; i < close.length; i++) {
    // Calculate RSV (9-day window)
    let highest = high[i];
    let lowest = low[i];
    
    // Look back 8 days (total 9)
    for (let j = 0; j < 9; j++) {
      if (i - j >= 0) {
        if (high[i - j] > highest) highest = high[i - j];
        if (low[i - j] < lowest) lowest = low[i - j];
      }
    }

    const rsv = highest === lowest ? 50 : ((close[i] - lowest) / (highest - lowest)) * 100;
    
    k = (2 / 3) * k + (1 / 3) * rsv;
    d = (2 / 3) * d + (1 / 3) * k;
    const j = 3 * k - 2 * d;

    kValues.push(k);
    dValues.push(d);
    jValues.push(j);
  }

  return { k: kValues, d: dValues, j: jValues };
};

// --- Pattern Recognition Logic ---

interface Pivot {
  index: number;
  price: number;
  type: 'high' | 'low';
  time: string;
}

// Find local highs and lows (ZigZag-like)
const findPivots = (data: ChartDataPoint[], leftStrength: number = 3, rightStrength: number = 3): Pivot[] => {
  const pivots: Pivot[] = [];
  
  for (let i = leftStrength; i < data.length - rightStrength; i++) {
    const currentHigh = data[i].high;
    const currentLow = data[i].low;
    
    // Check for Local High
    let isHigh = true;
    for (let j = 1; j <= leftStrength; j++) if (data[i - j].high > currentHigh) isHigh = false;
    for (let j = 1; j <= rightStrength; j++) if (data[i + j].high > currentHigh) isHigh = false;
    
    // Check for Local Low
    let isLow = true;
    for (let j = 1; j <= leftStrength; j++) if (data[i - j].low < currentLow) isLow = false;
    for (let j = 1; j <= rightStrength; j++) if (data[i + j].low < currentLow) isLow = false;

    if (isHigh) pivots.push({ index: i, price: currentHigh, type: 'high', time: data[i].time });
    if (isLow) pivots.push({ index: i, price: currentLow, type: 'low', time: data[i].time });
  }
  return pivots;
};

export const detectChartPatterns = (data: ChartDataPoint[]): ChartMarker[] => {
  const markers: ChartMarker[] = [];
  // Used slightly stronger pivot detection to find significant points for triangles
  const pivots = findPivots(data, 3, 2); 
  const tolerance = 0.03; 

  if (pivots.length < 5) return markers;

  // We iterate backwards to prioritize recent patterns
  const lows = pivots.filter(p => p.type === 'low');
  const highs = pivots.filter(p => p.type === 'high');

  // 1. Double Bottom (W)
  for (let i = lows.length - 1; i >= 1; i--) {
    const p2 = lows[i]; 
    const p1 = lows[i - 1]; 
    const diff = Math.abs(p1.price - p2.price) / p1.price;
    if (diff < tolerance && (p2.index - p1.index) > 5) {
      const highBetween = pivots.find(p => p.type === 'high' && p.index > p1.index && p.index < p2.index);
      if (highBetween) {
         markers.push({ time: p2.time, position: 'belowBar', color: '#10b981', shape: 'arrowUp', text: '双底(W)' });
         i--; 
      }
    }
  }

  // 2. Double Top (M)
  for (let i = highs.length - 1; i >= 1; i--) {
    const p2 = highs[i];
    const p1 = highs[i - 1];
    const diff = Math.abs(p1.price - p2.price) / p1.price;
    if (diff < tolerance && (p2.index - p1.index) > 5) {
      const lowBetween = pivots.find(p => p.type === 'low' && p.index > p1.index && p.index < p2.index);
      if (lowBetween) {
         markers.push({ time: p2.time, position: 'aboveBar', color: '#ef4444', shape: 'arrowDown', text: '双顶(M)' });
         i--;
      }
    }
  }

  // 3. Head and Shoulders (Top)
  if (highs.length >= 3) {
    for (let i = highs.length - 1; i >= 2; i--) {
      const rs = highs[i];
      const head = highs[i-1];
      const ls = highs[i-2];
      if (head.price > ls.price && head.price > rs.price) {
         const shoulderDiff = Math.abs(ls.price - rs.price) / ls.price;
         if (shoulderDiff < 0.05) {
             markers.push({ time: rs.time, position: 'aboveBar', color: '#f59e0b', shape: 'arrowDown', text: '头肩顶' });
             i -= 2;
         }
      }
    }
  }

  // NEW: Trendline-based Patterns (Triangles, Wedges)
  // Logic: Check slope of line connecting the last 2 major highs and last 2 major lows
  if (highs.length >= 2 && lows.length >= 2) {
      const h2 = highs[highs.length - 1];
      const h1 = highs[highs.length - 2];
      const l2 = lows[lows.length - 1];
      const l1 = lows[lows.length - 2];

      // Only check if patterns are relatively recent (active in the last window)
      // Check if the last pivot is within the last 20 bars of data provided
      const lastPivotIndex = Math.max(h2.index, l2.index);
      if (data.length - lastPivotIndex < 25) {
          
          // Calculate slope as % change per bar
          const slopeH = ((h2.price - h1.price) / h1.price) / (h2.index - h1.index);
          const slopeL = ((l2.price - l1.price) / l1.price) / (l2.index - l1.index);
          
          // Thresholds
          const flatThreshold = 0.001; // 0.1% change per bar is considered flat

          // 4. Ascending Triangle (Rising Lows, Flat Highs) -> Bullish
          if (slopeL > flatThreshold && Math.abs(slopeH) < flatThreshold) {
              markers.push({
                  time: h2.index > l2.index ? h2.time : l2.time,
                  position: 'inBar',
                  color: '#10b981',
                  shape: 'arrowUp',
                  text: '上升三角形'
              });
          }

          // 5. Descending Triangle (Lower Highs, Flat Lows) -> Bearish
          else if (slopeH < -flatThreshold && Math.abs(slopeL) < flatThreshold) {
               markers.push({
                  time: h2.index > l2.index ? h2.time : l2.time,
                  position: 'inBar',
                  color: '#ef4444',
                  shape: 'arrowDown',
                  text: '下降三角形'
              });
          }

          // 6. Symmetrical Triangle (Lower Highs, Higher Lows) -> Consolidating
          else if (slopeH < -flatThreshold && slopeL > flatThreshold) {
               markers.push({
                  time: h2.index > l2.index ? h2.time : l2.time,
                  position: 'inBar',
                  color: '#f59e0b', // Amber
                  shape: 'circle',
                  text: '对称三角形'
              });
          }

          // 7. Rising Wedge (Higher Highs, Higher Lows, but converging) -> Bearish Reversal
          // SlopeL > SlopeH usually means lows catching up to highs
          else if (slopeH > flatThreshold && slopeL > flatThreshold) {
              if (slopeL > slopeH) {
                  markers.push({
                      time: h2.index > l2.index ? h2.time : l2.time,
                      position: 'aboveBar',
                      color: '#ef4444',
                      shape: 'arrowDown',
                      text: '上升楔形'
                  });
              }
          }

          // 8. Falling Wedge (Lower Highs, Lower Lows, converging) -> Bullish Reversal
          // SlopeH < SlopeL (Highs dropping steeper than Lows dropping)
          else if (slopeH < -flatThreshold && slopeL < -flatThreshold) {
              if (slopeH < slopeL) {
                  markers.push({
                      time: h2.index > l2.index ? h2.time : l2.time,
                      position: 'belowBar',
                      color: '#10b981',
                      shape: 'arrowUp',
                      text: '下降楔形'
                  });
              }
          }
      }
  }

  return markers;
};
