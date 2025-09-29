
import { GoogleGenAI, Chat } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

export const createChatSession = async (): Promise<Chat> => {
  const chat = ai.chats.create({
    model,
    config: {
        systemInstruction: 'You are a dynamic and helpful AI assistant. Your responses should be conversational, intelligent, and context-aware. Maintain a friendly yet professional tone.',
    },
  });
  return chat;
};
