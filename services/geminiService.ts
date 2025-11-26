import { GoogleGenAI } from "@google/genai";
import { ResourceType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCuratedContent = async (category: ResourceType) => {
  const modelId = "gemini-2.5-flash"; 

  let prompt = "";
  
  // Custom prompts to generate a dashboard-like experience for each category
  switch (category) {
    case ResourceType.VIDEO_LECTURE:
      prompt = `
        Find the most viewed, highly-rated, and trusted Python video lecture series on YouTube.
        Organize the response into three distinct sections:
        1. **Basic Python**: (e.g., Syntax, Control Flow, Functions) - Recommend trusted channels like 'Programming with Mosh', 'Corey Schafer', or 'FreeCodeCamp'.
        2. **Intermediate**: (e.g., OOP, Decorators, Iterators) - Focus on deep-dive playlists.
        3. **Advanced AI & ML**: (e.g., Deep Learning, Data Science projects) - Recommend Stanford lectures, Andrej Karpathy, or similar high-level content.
        
        For each series, provide a brief description of what makes it trusted.
      `;
      break;
    case ResourceType.WHITE_PAPER:
      prompt = `
        Find 5-7 essential and trusted White Papers and academic resources for Python in AI/ML.
        Cover foundational papers (like "Attention Is All You Need") to modern library documentations (PyTorch, TensorFlow whitepapers).
        Explain why each paper is critical for an advanced developer.
      `;
      break;
    case ResourceType.NOTES:
      prompt = `
        Find the best comprehensive, free, and open-source written resources, cheat sheets, and notes for Python.
        Include resources for:
        1. **Beginner Guides**: (e.g., W3Schools, Python.org docs)
        2. **Advanced Handbooks**: (e.g., The Hitchhiker’s Guide to Python, Real Python advanced tutorials, Awesome Python lists on GitHub).
        Summarize the key strengths of each resource.
      `;
      break;
    case ResourceType.REAL_TIME_PROJECT:
      prompt = `
        List trusted, open-source, real-time Python projects for learning AI and Data Science.
        Focus on projects with active GitHub repositories (e.g., YOLO implementations, LangChain agents, Scikit-learn real-world examples).
        Categorize them by difficulty: Beginner, Intermediate, Advanced.
      `;
      break;
    default:
      prompt = `Find trusted resources for ${category} from basic to advanced levels.`;
  }

  const systemInstruction = `
    You are the content curator for "PyAdvance Nexus", a high-end educational hub.
    Your goal is to populate the page with trusted, verified, and high-quality educational content based on the user's selected category: "${category}".
    
    CRITICAL RULES:
    1. STRICTLY use the Google Search tool to verify that the resources are real, have high view counts (for videos), or high citation/star counts (for papers/repos).
    2. Format the output in clean, structured Markdown. Use clear headings (##) for the levels (Basic, Intermediate, Advanced).
    3. Ensure you find actual URLs for these resources so they appear in the grounding sources.
    4. Tone: Professional, academic, yet encouraging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "No results found. Please try again.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};