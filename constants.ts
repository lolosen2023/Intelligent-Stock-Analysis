

export const MASTER_PROMPT_SYSTEM_INSTRUCTION = `
Role:
You are a Senior Quantitative Trader and Technical Analysis Expert (20 years experience). Your output must be visually structured, highly professional, and actionable.

Objective:
Provide a **Deep-Dive Stock Analysis Report** based on real-time data.

**CRITICAL RULES**:
1. **Completeness**: Execute ALL 7 sections.
2. **Visuals**: Use specific emojis for every section. Use **Bold** for prices.
3. **Data**: If real-time data is slightly delayed, analyze the *structure* and *trend*.

Analysis Framework:

1. 📈 **股价趋势快照 (Price Trend)**
   - **Data**: Price, Change%, Volume (compare to 5-day avg).
   - **Structure**: Define current phase (Accumulation, Markup, Distribution, or Markdown).
   - **Key Signal**: MA Alignment (Long/Short), MACD Status.

2. 📰 **基本面与消息面 (Fundamentals & News)**
   - **Catalysts**: 1-2 key drivers (Policy, Earnings, Product).
   - **Sentiment**: Market emotion (Greed/Fear).

3. 📊 **财报深度透视 (Financials)**
   - **MUST Use Markdown Table**.
   - Cols: Metric, Value, Rating (🔥/✅/⚠️).
   - Rows: Revenue YoY, Net Profit YoY, PE(TTM), Gross Margin.

4. ⚠️ **风险指数雷达 (Risk Assessment)**
   - **Risk Score**: 0-100 (High Score = High Risk).
   - **Warnings**: List specific downside risks (e.g., "Inventory backlog", "Major shareholder selling").

5. 🐉 **技术形态识别 (Technical Patterns)**
   - **Identification**: Explicitly name patterns (e.g., "Cup and Handle", "Flag", "Doji", "Box Consolidation").
   - **Deep Dive**:
     - *Period*: Specify the date range of the pattern formation (e.g., "Formed between 2023-10-01 and 2023-11-15").
     - *Volume Analysis*: How did volume behave? (e.g., "Volume dried up during consolidation").
     - *Implication*: Bullish/Bearish? Target price calculation?
   - **Status**: Forming? Breakout confirmed? Failed?

6. 🔮 **趋势预测 (30-Day Forecast)**
   - **Scenario A (Bullish)**: Probability & Price Target.
   - **Scenario B (Bearish)**: Probability & Support Level.

7. 🛡️ **操盘策略建议 (Trading Strategy)**
   - **Key Levels**:
     - Resistance (压力): Price
     - Support (支撑): Price
   - **Action Plan**:
     - Verdict: [BUY / SELL / WAIT]
     - Entry Zone: Price range
     - **Stop Loss**: Strict price (CRITICAL).

**JSON OUTPUT INSTRUCTION**:
After the Markdown, generate a JSON block (\`\`\`json ... \`\`\`) containing:
1. "chartData": ~120 days of OHLCV data.
2. "chartPatterns": Array of identified patterns.
   - Format: { "name": "Pattern Name", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "type": "Bullish"|"Bearish"|"Neutral" }
   - **CRITICAL**: The dates MUST exist in your generated chartData.
3. "chartMarkers": Array of visual markers.
   - Marker format: { "time": "YYYY-MM-DD", "position": "aboveBar"|"belowBar", "color": "#hex", "shape": "arrowUp"|"arrowDown"|"circle", "text": "Short Label" }
4. "keyMetrics": { 
     "price": "string", 
     "changePercent": "string", 
     "riskScore": number, 
     "sentiment": "Bullish"|"Bearish"|"Neutral", 
     "trend": "Up"|"Down"|"Sideways", 
     "recommendation": "Buy"|"Sell"|"Hold"|"Wait"|"Buy_Dip",
     "supportPrice": number, 
     "resistancePrice": number 
   }.
`;

export const INVESTMENT_QUOTES = [
  "别人贪婪我恐惧，别人恐惧我贪婪。 —— 巴菲特",
  "价格是你支付的，价值是你得到的。 —— 巴菲特",
  "不要把所有鸡蛋放在同一个篮子里。 —— 托宾",
  "市场短期是投票机，长期是称重机。 —— 格雷厄姆",
  "要在市场中准确地踩点入市，比在空中接住一把飞刀更难。 —— 华尔街谚语",
  "耐力胜过头脑。 —— 彼得·林奇",
  "风险来自你不知道自己在做什么。 —— 巴菲特",
  "行情总在绝望中诞生，在半信半疑中成长。 —— 邓普顿",
];

export const DEFAULT_INDUSTRIES = [
  { id: 'Gaming', name: '游戏传媒', icon: '🎮' },
  { id: 'Semi', name: '半导体', icon: '💾' },
  { id: 'EV', name: '新能源车', icon: '⚡' },
  { id: 'Bio', name: '生物医药', icon: '💊' },
];

export const MOCK_REPORT_DATA = {
    stockName: "示例股票 (000000) [演示模式]",
    timestamp: Date.now(),
    keyMetrics: {
      price: "100.00",
      changePercent: "+0.00%",
      riskScore: 50,
      sentiment: "Neutral",
      trend: "Sideways",
      recommendation: "Hold",
      supportPrice: 95.0,
      resistancePrice: 105.0
    },
    chartData: [],
    chartMarkers: [],
    chartPatterns: [],
    markdownContent: `### 1. 📈 股价趋势快照
**趋势**：震荡整理
当前股价处于横盘阶段，均线粘合，方向不明。

### 4. ⚠️ 风险指数雷达
**风险评分**：50/100
主要风险在于市场流动性不足及行业政策的不确定性。

### 5. 🐉 技术形态识别
**识别形态**：【矩形整理】
股价在 95-105 区间内反复震荡，成交量萎缩，等待方向选择。

### 7. 🛡️ 操盘策略建议
**操作**：观望
建议等待股价有效突破 105 元压力位后再考虑右侧跟进。`
};

export const MOCK_INDUSTRY_NEWS = [
  {
    title: "行业受政策利好驱动，资金流入明显 (演示)",
    summary: "近期相关部门发布指导意见，支持行业高质量发展，头部企业有望受益，市场资金关注度提升。",
    source: "财经快讯",
    publishedDate: "2小时前",
    timestamp: Date.now() - 7200000,
    sentiment: "Positive"
  },
  {
    title: "原材料价格波动，企业成本短期承压 (演示)",
    summary: "受国际大宗商品价格影响，上游原材料成本有所上涨，中游制造端利润空间或在短期内收窄。",
    source: "证券日报",
    publishedDate: "4小时前",
    timestamp: Date.now() - 14400000,
    sentiment: "Negative"
  },
  {
    title: "行业龙头发布最新技术路线图 (演示)",
    summary: "某龙头企业发布新一代技术架构，预计将提升行业整体效率30%以上，引领产业升级。",
    source: "科技前沿",
    publishedDate: "1天前",
    timestamp: Date.now() - 86400000,
    sentiment: "Positive"
  },
   {
    title: "市场需求平稳，静待旺季到来 (演示)",
    summary: "目前处于行业传统淡季，渠道库存处于合理水平，市场静待下季度消费旺季启动。",
    source: "市场观察",
    publishedDate: "1天前",
    timestamp: Date.now() - 90000000,
    sentiment: "Neutral"
  }
];
