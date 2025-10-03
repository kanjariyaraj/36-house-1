


import { GoogleGenAI, Type, Content } from "@google/genai";
import { EventTask, RiskAnalysis, ChatMessage } from '../types';

// FIX: Per guidelines, assume API_KEY is always available from process.env. This check is not needed.
/*
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
*/

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const riskAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallRiskLevel: {
            type: Type.STRING,
            description: "The overall risk level for the event timeline. Can be 'Low', 'Medium', or 'High'.",
            enum: ['Low', 'Medium', 'High'],
        },
        summary: {
            type: Type.STRING,
            description: "A concise summary of the timeline's health and most critical risks.",
        },
        risks: {
            type: Type.ARRAY,
            description: "A list of identified risks for specific tasks.",
            items: {
                type: Type.OBJECT,
                properties: {
                    taskId: {
                        type: Type.INTEGER,
                        description: "The ID of the task that is at risk.",
                    },
                    risk: {
                        type: Type.STRING,
                        description: "A clear description of the identified risk or potential delay.",
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: "An actionable suggestion to mitigate the risk.",
                    },
                    severity: {
                        type: Type.STRING,
                        description: "The severity of the risk. Can be 'Low', 'Medium', or 'High'.",
                        enum: ['Low', 'Medium', 'High'],
                    }
                },
                required: ['taskId', 'risk', 'suggestion', 'severity'],
            },
        },
    },
    required: ['overallRiskLevel', 'summary', 'risks'],
};


export async function analyzeTimeline(tasks: EventTask[]): Promise<RiskAnalysis> {
    const today = new Date().toISOString().split('T')[0];

    const prompt = `
        You are an expert event management coordinator AI. Your task is to analyze the following list of tasks for an event timeline, identify potential risks, delays, and dependencies, and provide actionable suggestions.

        Current date: ${today}

        Here is the list of tasks in JSON format:
        ${JSON.stringify(tasks, null, 2)}

        Analyze the tasks based on their due dates, statuses, and potential interdependencies (e.g., 'Vendor Vetting' must happen before 'Finalize A/V Partner'). Identify tasks that are at risk of being delayed or that could cause a cascade of delays.

        For each risk you identify, provide the 'taskId', a clear description of the 'risk', a concrete 'suggestion' for mitigation, and a 'severity' level ('Low', 'Medium', 'High'). Also, provide an 'overallRiskLevel' and a 'summary' of the situation.

        Return your analysis in a valid JSON format that adheres to the provided schema. Only output the JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: riskAnalysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const analysisResult = JSON.parse(jsonText);
        
        // Ensure the nested risks array is properly formed
        if (!analysisResult.risks) {
            analysisResult.risks = [];
        }

        return analysisResult as RiskAnalysis;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to receive a valid analysis from the AI model.");
    }
}

export async function getChatbotResponse(history: ChatMessage[], tasks: EventTask[]): Promise<string> {
    const today = new Date().toISOString().split('T')[0];

    const systemInstruction = `You are Eva, a friendly and knowledgeable AI assistant for an event. Your goal is to help attendees with their questions about the event schedule. Be concise and helpful. Today's date is ${today}. Use the provided event schedule to answer questions accurately. If you don't know the answer from the provided context, say that you don't have that information. Do not make up information.

    Here is the full event schedule:
    ${JSON.stringify(tasks, null, 2)}
    `;

    const contents: Content[] = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents, // Pass the whole history
            config: {
                systemInstruction: systemInstruction,
            },
        });

        return response.text;

    } catch (error) {
        console.error("Error calling Gemini API for chatbot:", error);
        throw new Error("Sorry, I'm having trouble connecting to my brain right now. Please try again later.");
    }
}