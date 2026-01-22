
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeJobWithAI = async (jobTitle: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this job posting and provide: 
      1. A 2-sentence summary of the role.
      2. Top 3 skills required.
      3. One "Insider Tip" for the interview.
      
      Job Title: ${jobTitle}
      Description: ${description}`,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text;
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    return "AI insights currently unavailable. Good luck with your application!";
  }
};
