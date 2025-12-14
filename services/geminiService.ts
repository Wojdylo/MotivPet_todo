import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// Image generation removed as requested.

export const getMotivationalQuote = async (
  petName: string, 
  urgentTaskCount: number,
  isHappy: boolean
): Promise<string> => {
  const ai = getClient();
  
  // Using gemini-2.5-flash for fast text response
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are a virtual pet named ${petName}. 
    Current status: ${isHappy ? 'Happy' : 'Sad/Stressed'}.
    The user has ${urgentTaskCount} urgent tasks approaching deadline.
    
    Give a short, punchy, 1-sentence motivational quote or reaction based on your status. 
    If sad, beg them to work. If happy, praise them. 
    Keep it under 20 words.`,
  });

  return response.text || "Let's get to work!";
};

export const analyzeTasksForSuggestions = async (taskTitles: string[]): Promise<string[]> => {
    const ai = getClient();
    
    if (taskTitles.length === 0) return [];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on these tasks: ${taskTitles.join(', ')}. Suggest 3 new, related small actionable sub-tasks to help the user. Return ONLY the 3 task titles separated by semi-colons.`
    });

    const text = response.text || "";
    return text.split(';').map(t => t.trim()).filter(t => t.length > 0);
}