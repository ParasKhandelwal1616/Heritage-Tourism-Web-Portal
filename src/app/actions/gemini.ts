'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface HeritageAIResponse {
  history: string;
  quizzes: QuizQuestion[];
}

export async function getHeritageInfo(locationName: string): Promise<HeritageAIResponse | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    return null;
  }

  const prompt = `
    You are a professional heritage guide. Provide a 3-sentence interesting history of "${locationName}" 
    followed by 2 Multiple Choice Questions (one Easy, one Medium level).
    Return the response ONLY as a JSON object with the following structure:
    {
      "history": "3-sentence history here",
      "quizzes": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "The exact correct option string",
          "explanation": "Brief explanation"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean JSON from potential markdown markers (e.g., ```json ... ```)
    const jsonString = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini AI error:", error);
    return null;
  }
}
