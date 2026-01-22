
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VisionData, ProfilePersona } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVisionMetadata = async (prompt: string, base64Image?: string | null): Promise<VisionData> => {
  const parts: any[] = [{ text: `Create a detailed aesthetic vision for the concept: "${prompt}".` }];
  
  if (base64Image) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image.split(',')[1]
      }
    });
    parts[0].text += " Use the provided image as a visual and atmospheric reference.";
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          palette: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              colors: {
                type: Type.ARRAY,
                items: { type: Type.STRING, description: "Hex codes" }
              }
            },
            required: ["name", "colors"]
          }
        },
        required: ["title", "description", "keywords", "palette"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as VisionData;
};

export const generateProfileMetadata = async (prompt: string, base64Image?: string | null): Promise<Omit<ProfilePersona, 'images'>> => {
  const parts: any[] = [{ text: `Create a professional persona profile based on this description: "${prompt}". Provide a name, a poetic 1-sentence bio, a short vibe description, a distinct visual style (e.g. "Minimalist", "Cyberpunk", "Ethereal"), and one dominant aesthetic hex color.` }];
  
  if (base64Image) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image.split(',')[1]
      }
    });
    parts[0].text += " Use the facial features, style, and mood of the provided image to define this persona.";
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          bio: { type: Type.STRING },
          vibe: { type: Type.STRING },
          style: { type: Type.STRING },
          accentColor: { type: Type.STRING }
        },
        required: ["name", "bio", "vibe", "style", "accentColor"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateVisionImage = async (prompt: string, style: string, aspectRatio: "1:1" | "16:9" = "16:9", base64Image?: string | null): Promise<string> => {
  const fullPrompt = `A high-quality, professional ${aspectRatio === "1:1" ? 'portrait profile picture' : 'mood board image'} for the concept: ${prompt}. Style: ${style}. Aesthetic, editorial photography, cinematic lighting.`;
  
  const parts: any[] = [{ text: fullPrompt }];
  
  if (base64Image) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image.split(',')[1]
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio
      }
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Failed to generate image");
};

export const editImage = async (base64Image: string, editPrompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: 'image/png',
          },
        },
        {
          text: editPrompt,
        },
      ],
    },
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Failed to edit image");
};

export const generateVisionAudio = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `In a calm, professional, artistic narrator voice, describe this mood board: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    return base64Audio;
  }
  throw new Error("Failed to generate audio");
};
