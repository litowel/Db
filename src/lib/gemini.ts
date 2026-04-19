import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API client
// Note: In Vite, process.env is injected via the vite.config.ts define block
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface EligibilityAnalysis {
  isQualified: boolean;
  revenue: number;
  industry: string;
  riskScore: number;
  estimatedFundingMin: number;
  estimatedFundingMax: number;
  suggestedFundingTypes: string[];
  insights: string[];
  improvements: string[];
}

export async function analyzeBusinessEligibility(data: {
  revenue: number;
  industry: string;
  country: string;
  socialPresence: string;
  hasFinancialStatement?: boolean;
  documentFile?: { mimeType: string; data: string };
}): Promise<EligibilityAnalysis> {
  const prompt = `You are a Fintech AI analyzer for 'DealBridge AI'.
Analyze the funding eligibility for a business with the following profile:
- Annual Revenue: $${data.revenue}
- Industry: ${data.industry}
- Operating Country: ${data.country}
- Social/Web Presence: ${data.socialPresence}
- Document Provided: ${data.hasFinancialStatement ? 'Recent business financial statement uploaded.' : 'None'}

Determine if this business is qualified for partner funding. 
General guidelines: Revenue > $50,000 in major/supported markets is typically 'Qualified'. 
A lower risk score (0-100) is better. 
If a financial statement is attached, deeply analyze it to adjust the risk score (lower if finances are healthy, higher if concerning) and accurately adjust estimated funding amounts based on the specific metrics in the document.
Estimated funding is usually 10% to 30% of annual revenue, but adjust if document proves strong cash flow.
Provide 2 realistic business insights explaining why they are or aren't qualified (reference the document explicitly if it was provided).
Provide 2 actionable improvements they should make to increase their funding chances or amount.`;

  try {
    const requestContents: any = data.documentFile ? [
      prompt,
      { inlineData: data.documentFile }
    ] : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: requestContents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isQualified: { 
              type: Type.BOOLEAN, 
              description: "True if revenue > 50000 and viable industry/country" 
            },
            riskScore: { 
              type: Type.INTEGER, 
              description: "Risk score from 0 to 100" 
            },
            estimatedFundingMin: { 
              type: Type.INTEGER, 
              description: "Minimum estimated funding amount (0 if not qualified)" 
            },
            estimatedFundingMax: { 
              type: Type.INTEGER, 
              description: "Maximum estimated funding amount (0 if not qualified)" 
            },
            suggestedFundingTypes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of funding types like 'Revenue-Based Financing', 'Term Loan', 'Micro-loan'"
            },
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 specific positive or analytical insights about their profile"
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 actionable steps to improve funding chances"
            }
          },
          required: ["isQualified", "riskScore", "estimatedFundingMin", "estimatedFundingMax", "suggestedFundingTypes", "insights", "improvements"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      ...result,
      revenue: data.revenue,
      industry: data.industry,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if AI fails
    const isQualified = data.revenue > 50000;
    return {
      isQualified,
      revenue: data.revenue,
      industry: data.industry,
      riskScore: isQualified ? 35 : 85,
      estimatedFundingMin: isQualified ? data.revenue * 0.1 : 0,
      estimatedFundingMax: isQualified ? data.revenue * 0.3 : 0,
      suggestedFundingTypes: isQualified ? ["Revenue-Based Financing", "Term Loan"] : ["Micro-loan"],
      insights: ["Fallback analysis: Consistent revenue is a strong indicator."],
      improvements: ["Increase MRR to unlock higher funding tiers."]
    };
  }
}
