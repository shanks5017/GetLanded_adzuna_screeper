/// <reference types="vite/client" />
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeJobWithAI = async (jobTitle: string, description: string) => {
  try {
    const ai = getAIClient();
    if (!ai) {
      return "AI insights unavailable (API Key missing).";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Using a valid model name (check if flash-preview is valid or use standard)
      contents: `Analyze this job posting and provide: 
      1. A 2-sentence summary of the role.
      2. Top 3 skills required.
      3. One "Insider Tip" for the interview.
      
      Job Title: ${jobTitle}
      Description: ${description}`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    return "AI insights currently unavailable. Good luck with your application!";
  }
};
