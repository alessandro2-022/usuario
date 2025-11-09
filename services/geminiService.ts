import { GoogleGenAI } from "@google/genai";
import type { UserLocation, GroundingSource } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export type GeminiMode = 'chat' | 'search' | 'maps' | 'thinking';

export interface GeminiResponse {
  text: string;
  sources: GroundingSource[];
}

export const getGeminiResponse = async (
  prompt: string,
  mode: GeminiMode,
  location: UserLocation | null
): Promise<GeminiResponse> => {
  try {
    let response;
    const commonConfig = {
      contents: prompt,
    };
    
    switch (mode) {
      case 'search':
        response = await ai.models.generateContent({
          ...commonConfig,
          model: 'gemini-2.5-flash',
          config: {
            tools: [{ googleSearch: {} }],
          },
        });
        break;
      
      case 'maps':
        if (!location) {
          return { text: "I need your location to help with map-related questions. Please enable location services.", sources: [] };
        }
        response = await ai.models.generateContent({
          ...commonConfig,
          model: 'gemini-2.5-flash',
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
              },
            },
          },
        });
        break;

      case 'thinking':
        response = await ai.models.generateContent({
          ...commonConfig,
          model: 'gemini-2.5-pro',
          config: {
            thinkingConfig: { thinkingBudget: 32768 },
          },
        });
        break;

      case 'chat':
      default:
        response = await ai.models.generateContent({
          ...commonConfig,
          model: 'gemini-2.5-flash',
        });
        break;
    }
    
    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = groundingChunks.map((chunk: any) => ({
      uri: chunk.web?.uri || chunk.maps?.uri || '#',
      title: chunk.web?.title || chunk.maps?.title || 'Source',
    })).filter((source: GroundingSource) => source.uri !== '#');

    return { text, sources };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { text: "Sorry, I encountered an error. Please try again.", sources: [] };
  }
};
