
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const API_KEY = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Models
const TEXT_MODEL = 'gemini-3-flash-preview';
const TUTOR_MODEL = 'gemini-3-pro-preview';

/**
 * Generates educational content for a specific topic.
 */
export const generateLessonContent = async (topic: string, unit: string) => {
  if (!API_KEY) throw new Error("API Key missing");

  const prompt = `
    You are an expert Engineering Professor specializing in Heat and Mass Transfer.
    Create a concise but comprehensive lesson on the topic: "${topic}" from the unit "${unit}".
    
    Structure the response in Markdown:
    1. **Concept Definition**: Clear explanation.
    2. **Mathematical Formulation**: Relevant formulas (use clean text representation or LaTeX like $E=mc^2$).
    3. **Key Insights**: Bullet points on physical significance.
    4. **Real-world Example**: A practical engineering application.
    5. **Diagram Description**: A text description of what a diagram for this concept would look like.
  `;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are a rigorous engineering tutor. Provide accurate, professional, and clear explanations.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Lesson generation failed:", error);
    return "Failed to load lesson content.";
  }
};

/**
 * Generates an SVG code string for a diagram.
 */
export const generateDiagramSvg = async (topic: string) => {
  if (!API_KEY) return null;

  const prompt = `
    Create a simple, schematic SVG code (raw <svg> string) explaining: "${topic}".
    Use engineering schematic style. Ensure viewBox="0 0 400 300".
  `;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });
    let svg = response.text || "";
    svg = svg.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
    return svg.startsWith('<svg') ? svg : null;
  } catch (error) {
    return null;
  }
};

/**
 * Generates quiz questions with robust error handling.
 */
export const generateQuizQuestions = async (unitTitle: string, difficulty: string): Promise<QuizQuestion[]> => {
  if (!API_KEY) throw new Error("API Key missing");

  const prompt = `
    Generate 3 ${difficulty} level multiple choice questions for the engineering unit: "${unitTitle}".
    Return purely a JSON array. 
    Schema: [{ "id": number, "question": "string", "options": ["s1", "s2", "s3", "s4"], "correctAnswerIndex": number, "explanation": "string", "difficulty": "${difficulty}" }]
  `;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
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
    
    const text = response.text.trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Quiz generation failed:", error);
    return [];
  }
};

/**
 * Chat with the AI Tutor, aware of the provided PDF link as default source.
 */
export const sendTutorMessage = async (
  message: string, 
  history: {role: string, parts: {text: string}[]}[], 
  fileBase64?: string,
  mimeType: string = 'application/pdf'
) => {
  if (!API_KEY) throw new Error("API Key missing");

  const parts: any[] = [{ text: message }];
  
  if (fileBase64) {
    parts.unshift({
      inlineData: { data: fileBase64, mimeType: mimeType }
    });
  }

  try {
    const chat = ai.chats.create({
      model: TUTOR_MODEL,
      config: {
        systemInstruction: `You are the ThermoMaster AI Tutor.
        PRIMARY SOURCE: You have access to the knowledge within the document at https://drive.google.com/file/d/1hq_VegisUcJbj84iFerwpdRaQykznxjG/view.
        When asked theory or analytical problems, use this document as your primary reference and source of truth.
        If a user provides a new document, prioritize the new document for that specific query.
        Be precise with engineering formulas and units.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message: { parts: parts } });
    return result.text;
  } catch (error) {
    console.error("Chat failed:", error);
    return "I'm having trouble connecting to the knowledge base. Please try again.";
  }
};
