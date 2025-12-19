
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// The API key is obtained exclusively from the environment variable process.env.API_KEY.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models based on task requirements
const CONTENT_MODEL = 'gemini-3-flash-preview';
const TUTOR_MODEL = 'gemini-3-pro-preview';

/**
 * Generates educational content for a specific topic.
 */
export const generateLessonContent = async (topic: string, unit: string) => {
  const ai = getAI();
  const prompt = `
    You are an expert Engineering Professor specializing in Heat and Mass Transfer (HMT).
    Create a detailed, high-quality lesson on the topic: "${topic}" from the unit "${unit}".
    
    Structure the response in Markdown:
    1. **Overview**: High-level explanation of the concept.
    2. **Governing Equations**: State the fundamental laws (Fourier's, Newton's, Stefan-Boltzmann, or Fick's) and derive/present key formulas. Use LaTeX for math ($E=mc^2$).
    3. **Physical Significance**: What do the parameters (like Thermal Conductivity, Convection Coeff, etc.) mean physically?
    4. **Numerical Example**: Provide a simple worked-out numerical problem description.
    5. **Industrial Applications**: Where is this used in modern engineering?
    6. **Diagram Prompt**: Describe a detailed schematic diagram for this topic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: CONTENT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are a rigorous and helpful engineering professor. Use professional terminology and clear LaTeX formatting for equations.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Lesson generation failed:", error);
    return "Failed to load lesson content. Please ensure the API Key is valid.";
  }
};

/**
 * Generates an SVG code string for a diagram.
 */
export const generateDiagramSvg = async (topic: string) => {
  const ai = getAI();
  const prompt = `
    Generate a clean, professional engineering schematic SVG for: "${topic}".
    Use a minimalist style with lines, simple shapes, and clear text labels.
    Return ONLY the raw <svg>...</svg> code.
    Ensure viewBox="0 0 400 250" and use neutral colors (slate, blue, red for heat).
  `;

  try {
    const response = await ai.models.generateContent({
      model: CONTENT_MODEL,
      contents: prompt,
    });
    let svg = response.text || "";
    // Clean markdown wrappers if present
    svg = svg.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
    return svg.startsWith('<svg') ? svg : null;
  } catch (error) {
    return null;
  }
};

/**
 * Generates quiz questions with robust schema.
 */
export const generateQuizQuestions = async (unitTitle: string, difficulty: string): Promise<QuizQuestion[]> => {
  const ai = getAI();
  const prompt = `
    Generate 5 ${difficulty} level multiple choice questions for the engineering unit: "${unitTitle}".
    Focus on conceptual understanding and basic calculations.
    Return purely a JSON array. 
  `;

  try {
    const response = await ai.models.generateContent({
      model: CONTENT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswerIndex", "explanation", "difficulty"]
          }
        }
      }
    });
    
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Quiz generation failed:", error);
    return [];
  }
};

/**
 * Chat with the AI Tutor using reasoning.
 */
export const sendTutorMessage = async (
  message: string, 
  history: {role: 'user' | 'model', parts: {text: string}[]}[], 
  fileBase64?: string,
  mimeType: string = 'application/pdf'
) => {
  const ai = getAI();
  const parts: any[] = [{ text: message }];
  
  if (fileBase64) {
    parts.unshift({
      inlineData: { data: fileBase64, mimeType: mimeType }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: TUTOR_MODEL,
      contents: { parts: parts },
      config: {
        systemInstruction: `You are the ThermoMaster AI Tutor, an expert in Heat and Mass Transfer.
        Use reasoning to solve complex engineering problems. 
        Focus on accuracy in formulas, unit conversions, and physical interpretations.
        If the user provides a PDF or image, analyze it thoroughly as the primary context.`,
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return response.text;
  } catch (error: any) {
    console.error("Chat failed:", error);
    if (error?.message?.includes("Requested entity was not found")) {
      return "Error: API model access issue. Ensure you are using a supported project/key.";
    }
    return "I'm having trouble processing that request. Let's try another question.";
  }
};
