
import { GoogleGenAI } from "@google/genai";
import { COURSE_PPT_DATA } from "../data/courseData";

// Initialize AI with the mandatory API Key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const TUTOR_MODEL = 'gemini-3-pro-preview';

/**
 * Fetches lesson content from the local PPT-derived data store.
 */
export const getLessonFromPPT = (topic: string) => {
  const content = COURSE_PPT_DATA[topic];
  if (!content) return "Lesson content for this topic is being digitized. Please check back soon.";
  
  return `
# ${topic}
*Source: Heat & Mass Transfer Lecture Series*

${content.body}

---
### Key Equations
${content.equations || "See related slides for mathematical derivations."}

### Industrial Significance
${content.applications || "Consult the PPT for specific case studies."}
  `;
};

/**
 * AI Tutor remains active but is now grounded strictly in the PPT context.
 */
export const sendTutorMessage = async (
  message: string, 
  history: {role: 'user' | 'model', parts: {text: string}[]}[], 
  activeTopic: string
) => {
  const ai = getAI();
  const pptContext = COURSE_PPT_DATA[activeTopic];
  
  const systemInstruction = `
    You are the ThermoMaster AI Tutor. 
    Your primary source of truth is the Heat & Mass Transfer PPT by Purushothaman P (Asst Prof).
    
    Current Topic Context:
    ${pptContext ? pptContext.body : "General Heat and Mass Transfer"}
    
    Rules:
    1. If the user asks about theory, prioritize the definitions and explanations from the PPT.
    2. When solving math, use the exact notations used in the slides (e.g., k for thermal conductivity, h for convection).
    3. Be rigorous, academic, and cite "Slide References" where possible.
  `;

  try {
    const response = await ai.models.generateContent({
      model: TUTOR_MODEL,
      contents: { parts: [{ text: message }] },
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Tutor Error:", error);
    return "I'm having difficulty connecting to the lecture notes. Please try again.";
  }
};
