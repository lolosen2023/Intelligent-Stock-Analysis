
import { GoogleGenAI } from "@google/genai";
import { MASTER_PROMPT_SYSTEM_INSTRUCTION, MOCK_INDUSTRY_NEWS } from "../constants";
import { IndustryNewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// Upgrade to Pro model for complex reasoning and longer, more detailed reports
const modelId = 'gemini-3-pro-preview';

export const generateStockAnalysis = async (stockInput: string): Promise<{ markdown: string, jsonData: any }> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `User Request: 请对股票 "${stockInput}" 进行全维度的深度分析报告。

      Task Execution Steps:
      1. **Verify**: Check if "${stockInput}" is a valid stock entity. If invalid/delisted, return ONLY "INVALID_STOCK_ERROR".
      2. **Search & Analyze**: 
         - Use the search tool to find the Latest Price, Recent News (last 3 days), Financial Summary (Revenue/Net Income), and Key Events.
         - **CRITICAL**: You MUST generate content for ALL 7 SECTIONS defined in the System Instruction. Do not skip any section.
         - If specific financial data is not found, search for "analyst estimates" or use the most recent available quarter.
      3. **Format**: 
         - Use Markdown. 
         - **Use Tables** for Section 3 (Financials).
         - Highlight key prices (Support/Resistance) in bold.
      4. **Data Generation**:
         - At the VERY END, generate the JSON block for the chart.
         - Ensure chart data covers ~120 days and reflects the trend described in your text.`,
      config: {
        systemInstruction: MASTER_PROMPT_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.6, // Slightly lower temperature for more rigorous analysis
      },
    });

    const text = response.text;
    if (!text) throw new Error("未能生成分析报告，请重试。");

    // Check for explicit invalid stock flag
    if (text.includes("INVALID_STOCK_ERROR")) {
      throw new Error(`无法识别股票 "${stockInput}"。请检查代码或名称是否正确 (例如: 600519, 贵州茅台, NVDA)。`);
    }

    // Extract JSON block
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonBlockRegex);
    
    let jsonData = null;
    let markdown = text;

    if (match && match[1]) {
      try {
        jsonData = JSON.parse(match[1]);
        markdown = text.replace(match[0], '').trim();
      } catch (e) {
        console.warn("JSON Parsing Error", e);
      }
    }

    // Safety check: If no JSON and text is suspicious or very short
    if (!jsonData && text.length < 100) {
       if (text.includes("无法") || text.includes("找不到") || text.includes("error")) {
          throw new Error(`未找到 "${stockInput}" 的相关数据，请重新输入。`);
       }
    }

    return { markdown, jsonData };

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    // Handle 429 Quota Exceeded specifically
    if (error.message && (error.message.includes("429") || error.message.includes("Quota") || error.message.includes("RESOURCE_EXHAUSTED"))) {
        throw new Error("AI 服务调用次数超限 (429)。请稍后重试或检查 API 配额。");
    }

    if (error.message.includes("无法识别") || error.message.includes("未找到")) {
        throw error;
    }
    throw new Error("AI 分析服务繁忙，请稍后重试。");
  }
};

export const fetchIndustryInsights = async (industry: string): Promise<IndustryNewsItem[]> => {
  try {
    // REMOVED responseMimeType: "application/json" to prevent RPC errors with Search Tools.
    // Instead, we ask for JSON in the prompt and parse the string manually.
    const response = await ai.models.generateContent({
      model: modelId, 
      contents: `Search for the latest important news, policy updates, and market sentiment for the "${industry}" industry (last 3 days).
      
      CRITICAL INSTRUCTIONS:
      1. Content must be in **Simplified Chinese (简体中文)**.
      2. Return a JSON array ONLY. No markdown block markers.
      3. Format:
      [
        {
          "title": "News Title (Chinese)",
          "summary": "Brief summary max 40 words (Chinese)",
          "source": "Source Name",
          "publishedDate": "String (e.g. 2小时前)",
          "timestamp": Number (approximate unix timestamp in ms),
          "sentiment": "Positive" | "Negative" | "Neutral"
        }
      ]
      Limit to 5 items. Sort by newest first.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text;
    if (!text) return [];

    // Robust JSON parsing: look for array brackets
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
       return JSON.parse(jsonMatch[0]) as IndustryNewsItem[];
    }
    
    // Fallback: Try cleaning markdown if present
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
        return JSON.parse(cleaned) as IndustryNewsItem[];
    }

    return [];
  } catch (error: any) {
    console.error("Industry News Error:", error);
    // Fallback to MOCK data if API fails (e.g. Quota Exceeded 429)
    // This ensures the UI doesn't look broken during development or high traffic
    if (error.message && (error.message.includes("429") || error.message.includes("Quota") || error.message.includes("RESOURCE_EXHAUSTED"))) {
       console.warn("Using Mock News Data due to API Quota Limit");
       return MOCK_INDUSTRY_NEWS as IndustryNewsItem[];
    }
    return [];
  }
};
