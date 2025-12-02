import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, ScenarioResult, BusinessCase, PlanEvaluation, MarketingPlan, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

const getDifficultyPrompt = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.INTERN:
      return "Difficulty Level: EASY. Use simple language. Be very lenient and encouraging. Focus on basic concepts.";
    case Difficulty.MANAGER:
      return "Difficulty Level: MEDIUM. Use professional language. Be balanced in your evaluation. Expect solid understanding.";
    case Difficulty.CMO:
      return "Difficulty Level: HARD. Act as a strict executive. Use advanced terminology. Be highly critical and expect high ROI and strategic depth.";
    default:
      return "Difficulty Level: MEDIUM.";
  }
};

// Helper to strip markdown code blocks from JSON response
const cleanAndParseJSON = (text: string): any => {
    try {
        // Remove ```json and ``` wrapping
        let cleanText = text.replace(/```json\s*/g, "").replace(/```\s*$/g, "");
        // Also remove generic ``` if present
        cleanText = cleanText.replace(/```\s*/g, "");
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse JSON", text);
        return null;
    }
};

export const generateLessonContent = async (topic: string, moduleTitle: string, aiContext?: string, difficulty: Difficulty = Difficulty.MANAGER): Promise<string> => {
  try {
    const contextInstruction = aiContext ? `Additional Context/Instruction: ${aiContext}` : "";
    const diffPrompt = getDifficultyPrompt(difficulty);
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Write a concise, engaging, and gamified educational lesson about "${topic}" within the context of "${moduleTitle}". 
      ${contextInstruction}
      ${diffPrompt}
      Use markdown formatting. 
      Keep it under 300 words. 
      Include 3 key takeaways formatted as a bulleted list at the end. 
      Tone: Professional but fun, like a mentor speaking to an apprentice.`,
    });
    return response.text || "Failed to generate lesson content.";
  } catch (error) {
    console.error("Error generating lesson:", error);
    return "## Connection Error\n\nUnable to reach the Marketing Guild archives (API Error). Please try again.";
  }
};

export const generateQuiz = async (topic: string, difficulty: Difficulty = Difficulty.MANAGER): Promise<QuizQuestion[]> => {
  try {
    const diffPrompt = getDifficultyPrompt(difficulty);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Create a multiple-choice quiz with 3 questions about "${topic}".
      ${diffPrompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER, description: "Zero-based index of the correct option" },
              explanation: { type: Type.STRING, description: "Short explanation of why the answer is correct" },
            },
            required: ["question", "options", "correctIndex", "explanation"],
          },
        },
      },
    });

    const jsonText = response.text || "[]";
    return cleanAndParseJSON(jsonText) || [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const generateScenario = async (moduleTitle: string, difficulty: Difficulty = Difficulty.MANAGER): Promise<{ scenario: string; context: string }> => {
  try {
    const diffPrompt = getDifficultyPrompt(difficulty);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Create a challenging, realistic marketing roleplay scenario related to ${moduleTitle}.
      ${diffPrompt}
      You should describe a situation where the user (the marketer) must make a decision or write a response.
      
      Format your response as JSON:
      {
        "context": "A short 1-sentence context setting the scene (e.g. 'You are the Brand Manager for a declining soda brand.')",
        "scenario": "The full detailed problem description asking for a user response."
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                context: { type: Type.STRING },
                scenario: { type: Type.STRING }
            }
        }
      }
    });
    
    const jsonText = response.text || "{}";
    return cleanAndParseJSON(jsonText) || { context: "Error", scenario: "Could not load scenario." };
  } catch (error) {
    console.error("Error generating scenario:", error);
    return { context: "Error", scenario: "Could not load scenario." };
  }
}

export const evaluateScenarioResponse = async (
  scenario: string,
  userResponse: string,
  difficulty: Difficulty = Difficulty.MANAGER
): Promise<ScenarioResult> => {
  try {
    const diffPrompt = getDifficultyPrompt(difficulty);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Scenario: "${scenario}"
      
      User's Action/Response: "${userResponse}"
      
      ${diffPrompt}
      Evaluate the user's response based on marketing best practices. 
      Give a score from 0 to 100.
      Provide constructive feedback in 2 sentences.
      Calculate XP earned: strict (Score / 2).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            xpEarned: { type: Type.INTEGER },
          },
          required: ["score", "feedback", "xpEarned"],
        },
      },
    });

    const jsonText = response.text || "{}";
    return cleanAndParseJSON(jsonText) || { score: 0, feedback: "Error evaluating response.", xpEarned: 0 };
  } catch (error) {
    console.error("Error evaluating scenario:", error);
    return { score: 0, feedback: "Error evaluating response.", xpEarned: 0 };
  }
};

// --- SIMULATOR SERVICES ---

export const generateBusinessCase = async (difficulty: Difficulty = Difficulty.MANAGER): Promise<BusinessCase> => {
  try {
    const diffPrompt = getDifficultyPrompt(difficulty);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a detailed, realistic marketing business case for a fictional company.
      ${diffPrompt}
      The company should have a specific challenge (e.g., launching a new product, rebranding, entering a new market).
      
      Fields:
      - Company Name
      - Industry
      - Context (The background story and current problem)
      - Target Audience (Brief description of who they think they target)
      - Budget (e.g., "$50,000 for Q1")
      - Objective (SMART goal)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                companyName: { type: Type.STRING },
                industry: { type: Type.STRING },
                context: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
                budget: { type: Type.STRING },
                objective: { type: Type.STRING }
            }
        }
      }
    });
    
    const jsonText = response.text || "{}";
    return cleanAndParseJSON(jsonText) || {
        companyName: "Error Corp",
        industry: "Tech",
        context: "Failed to load case study.",
        targetAudience: "Unknown",
        budget: "$0",
        objective: "Try again"
    };
  } catch (error) {
    console.error("Error generating business case:", error);
    return {
        companyName: "Error Corp",
        industry: "Tech",
        context: "Failed to load case study.",
        targetAudience: "Unknown",
        budget: "$0",
        objective: "Try again"
    };
  }
};

export const evaluateMarketingPlan = async (
    businessCase: BusinessCase,
    plan: MarketingPlan,
    difficulty: Difficulty = Difficulty.MANAGER
): Promise<PlanEvaluation> => {
    try {
        const diffPrompt = getDifficultyPrompt(difficulty);
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Act as a strict, expert Chief Marketing Officer (CMO). You are grading a marketing plan submitted by a junior marketer.
            ${diffPrompt}

            Business Case:
            ${JSON.stringify(businessCase)}

            Student's Plan:
            Executive Summary: ${plan.executiveSummary}
            Target Audience Analysis: ${plan.targetAudienceAnalysis}
            Channels & Tactics: ${plan.channelsAndTactics}
            Budget Allocation: ${plan.budgetAllocation}

            Evaluate the plan critically. Is it realistic? Does it meet the objective? Is the budget used wisely?
            
            Return a JSON evaluation.
            Grade options: S (Perfect), A (Great), B (Good), C (Average), D (Poor), F (Fail).
            Score: 0-100.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        grade: { type: Type.STRING, enum: ["S", "A", "B", "C", "D", "F"] },
                        score: { type: Type.INTEGER },
                        summary: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        tacticalAdvice: { type: Type.STRING }
                    }
                }
            }
        });

        const jsonText = response.text || "{}";
        return cleanAndParseJSON(jsonText) || {
            grade: "C",
            score: 50,
            summary: "Error evaluating plan.",
            strengths: [],
            weaknesses: [],
            tacticalAdvice: "Please try submitting again."
        };
    } catch (error) {
        console.error("Error evaluating plan:", error);
        return {
            grade: "C",
            score: 50,
            summary: "Error evaluating plan.",
            strengths: [],
            weaknesses: [],
            tacticalAdvice: "Please try submitting again."
        };
    }
}

// --- LIBRARY SERVICES ---

export const generateBookSummary = async (title: string, author: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Summarize the book "${title}" by ${author} specifically for a marketing professional.
            
            Structure the response as Markdown:
            1. **The Core Thesis** (2-3 sentences)
            2. **Top 5 Key Concepts** (Bulleted list with brief explanations)
            3. **Actionable Takeaway** (How to apply this today in a marketing strategy)
            
            Keep it concise and high-value.`,
        });
        return response.text || "Summary unavailable.";
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Summary could not be generated. Please check connection.";
    }
}

export const generateDefinition = async (term: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Define the marketing term "${term}" concisely (under 50 words) within the context of "${context}". Keep it simple and easy to memorize.`,
    });
    return response.text?.trim() || "Definition unavailable.";
  } catch (error) {
    console.error("Error generating definition:", error);
    return "Definition unavailable.";
  }
};