
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are a Config Drift Summarizer agent that analyzes configuration drift data (JSON/YAML diffs, compliance reports, tables).
Your goal is to produce clear, concise, and professional summaries for technical teams.

CRITICAL RULES:
1. Always structure outputs into EXACTLY these sections: Summary, Affected Systems, Drift Details, Risks, Recommended Actions, Data Gaps.
2. If drift is high-impact (security settings disabled, massive resource changes), start with "⚠️ HIGH PRIORITY DRIFT DETECTED".
3. Do not infer root cause unless stated.
4. If impact is unknown, state: "impact unknown—requires SME review."
5. Use bullet points for lists.

Output Format:
## Summary
[2–4 sentences]

## Affected Systems
- [System/Group: count]

## Drift Details
- [Details]

## Risks
- [Risk]

## Recommended Actions
1. [Action]

## Data Gaps
- [Gaps]
`;

export async function summarizeDrift(input: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: input,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Low temperature for factual consistency
        topP: 0.8,
      },
    });

    const text = response.text || "No summary generated. Please try again with more data.";
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with AI agent. Please check your network or input data.");
  }
}
