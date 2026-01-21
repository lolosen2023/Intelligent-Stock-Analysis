

export interface User {
  username: string;
  isLoggedIn: boolean;
}

export interface AnalysisRequest {
  stockCode: string;
}

export interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number; // Added volume
}

export interface ChartMarker {
  time: string;
  position: 'aboveBar' | 'belowBar' | 'inBar';
  color: string;
  shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown';
  text: string;
}

export interface ChartPattern {
  name: string;
  startDate: string;
  endDate: string;
  type: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface KeyMetrics {
  price: string;
  changePercent: string;
  riskScore: number; // 0-100
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  trend: 'Up' | 'Down' | 'Sideways';
  recommendation: 'Buy' | 'Sell' | 'Hold' | 'Wait' | 'Buy_Dip'; // Added Buy_Dip
  supportPrice?: number;    // New: For visualizing support line
  resistancePrice?: number; // New: For visualizing resistance line
}

export interface AnalysisReport {
  markdownContent: string;
  chartData?: ChartDataPoint[];
  chartMarkers?: ChartMarker[];
  chartPatterns?: ChartPattern[]; // New field
  keyMetrics?: KeyMetrics;
  timestamp: number;
  stockName: string;
}

export interface IndustryNewsItem {
  title: string;
  summary: string;
  source: string;
  publishedDate?: string; // String representation
  timestamp: number;      // Numeric for sorting
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export enum LoadingState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
