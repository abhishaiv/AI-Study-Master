import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION_MENTOR } from "../constants";
import { LessonContent, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLessonContent = async (topicTitle: string, contextData: string): Promise<LessonContent> => {
  const prompt = `
    Create a structured study lesson for the topic: "${topicTitle}".
    
    Use the following RAG Context as the primary source of truth:
    <CONTEXT>
    ${contextData}
    </CONTEXT>

    Return a JSON object with the following structure:
    {
      "overview": "A concise summary of the topic.",
      "keyConcepts": [
        {"title": "Concept Name", "content": "Detailed explanation."}
      ],
      "codeExample": "Optional code snippet if relevant, else empty string.",
      "pitfalls": ["List of 3 common mistakes or misunderstandings."],
      "checklist": ["List of 3-5 things to master for this topic."]
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_MENTOR,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          keyConcepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING }
              }
            }
          },
          codeExample: { type: Type.STRING },
          pitfalls: { type: Type.ARRAY, items: { type: Type.STRING } },
          checklist: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}') as LessonContent;
};

export const generateQuizQuestions = async (topicTitle: string, contextData: string): Promise<QuizQuestion[]> => {
  const prompt = `
    Generate 5 multiple-choice quiz questions for: "${topicTitle}".
    Use the context provided:
    ${contextData}
    
    The difficulty should be moderate to hard.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_MENTOR,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctOptionIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '[]') as QuizQuestion[];
};

export const streamChatResponse = async function* (history: {role: string, parts: {text: string}[]}[], newMessage: string, currentContext?: string) {
  let systemInstruction = SYSTEM_INSTRUCTION_MENTOR;
  if (currentContext) {
    systemInstruction += `\n\nRelevant Context for current query:\n${currentContext}`;
  }

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
    history: history.map(h => ({
        role: h.role,
        parts: h.parts
    }))
  });

  const result = await chat.sendMessageStream({ message: newMessage });
  
  for await (const chunk of result) {
    yield chunk.text;
  }
};

export const reviewAssignmentDraft = async (assignmentPrompt: string, studentDraft: string): Promise<string> => {
  const prompt = `
    Task: Review this student assignment submission.
    
    Assignment Prompt:
    ${assignmentPrompt}
    
    Student Draft:
    ${studentDraft}
    
    Instructions:
    1. Identify logical errors or security risks (e.g., in code).
    2. Suggest structural improvements.
    3. DO NOT write the corrected code/text for them.
    4. Provide feedback in a structured Markdown format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_MENTOR,
    }
  });

  return response.text || "Unable to generate review.";
};