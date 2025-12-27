
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Flashcard, QuizQuestion, StudyPlanItem } from "../types";

const REASONING_MODEL = 'gemini-3-pro-preview';
const SPEED_MODEL = 'gemini-3-flash-preview';

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateReasoningResponse = async (
  prompt: string, 
  attachments: { data: string; mimeType: string }[] = []
) => {
  const ai = getGeminiClient();
  const parts: any[] = [{ text: prompt }];
  
  attachments.forEach(att => {
    parts.push({
      inlineData: {
        data: att.data.split(',')[1],
        mimeType: att.mimeType
      }
    });
  });

  const response = await ai.models.generateContent({
    model: REASONING_MODEL,
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: "You are MentorAI. Format your responses with clear headers (###), bold key terms, and bullet points. Focus on educational clarity and pedagogical structure."
    },
  });

  return {
    text: response.text,
    thinking: response.candidates?.[0]?.content?.parts?.find(p => p.thought)?.thought || ""
  };
};

export const generateFlashcards = async (content: string): Promise<Flashcard[]> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: SPEED_MODEL,
    contents: `Based on the following information, generate 5 high-quality flashcards for active recall. Focus on key concepts, definitions, and relationships:\n\n${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["id", "question", "answer", "category"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse flashcards", e);
    return [];
  }
};

export const generateQuiz = async (content: string): Promise<QuizQuestion[]> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: SPEED_MODEL,
    contents: `Generate a challenging 5-question multiple-choice quiz based on this content. Include one correct answer and three plausible distractors per question:\n\n${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse quiz", e);
    return [];
  }
};

export const generateStudyPlan = async (content: string): Promise<StudyPlanItem[]> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: SPEED_MODEL,
    contents: `Create a structured study plan with 4 key milestones based on this content:\n\n${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            tasks: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["id", "title", "duration", "tasks"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse study plan", e);
    return [];
  }
};
