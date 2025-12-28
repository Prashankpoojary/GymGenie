import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserData, WorkoutPlan, ChatMessage } from '../types';

function getAiClient() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey });
}

const workoutPlanSchema = {
    type: Type.OBJECT,
    properties: {
        schedule: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day_name: { type: Type.STRING },
                    focus_area: { type: Type.STRING },
                    exercises: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                sets: { type: Type.STRING },
                                reps: { type: Type.STRING },
                            },
                            required: ['name', 'sets', 'reps'],
                        },
                    },
                },
                required: ['day_name', 'focus_area', 'exercises'],
            },
        },
    },
    required: ['schedule'],
};

export async function generateWorkoutPlan(userData: UserData): Promise<WorkoutPlan> {
    const ai = getAiClient();
    const prompt = `
        User Profile:
        - Name: ${userData.name}
        - Age: ${userData.age}
        - Weight: ${userData.weight} kg
        - Height: ${userData.height} cm
        - Primary Goal: ${userData.goal}

        Based on this profile, create a detailed 4-week (28 days) workout routine. The routine should have a logical progression. Some days should be rest days, clearly marked with an empty exercises array.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "You are an elite Strength and Conditioning Coach. Generate a 4-week workout routine. Return the data ONLY in valid JSON format, adhering to the provided schema. The JSON must have a key for 'schedule' which is an array of days. Ensure there are 28 entries in the schedule array.",
            responseMimeType: "application/json",
            responseSchema: workoutPlanSchema,
        },
    });

    try {
        const jsonText = response.text.trim();
        const plan = JSON.parse(jsonText);
        // Basic validation
        if (plan && Array.isArray(plan.schedule)) {
          return plan;
        } else {
          throw new Error("Invalid workout plan structure received from API.");
        }
    } catch (e) {
        console.error("Failed to parse workout plan JSON:", e);
        throw new Error("Could not understand the workout plan from the AI. Please try again.");
    }
}


export const createNutritionChat = (userData: UserData): Chat => {
    const ai = getAiClient();
    const systemInstruction = `You are a certified Sports Nutritionist. You have access to the user's biometric data:
    - Height: ${userData.height} cm
    - Weight: ${userData.weight} kg
    - Goal: ${userData.goal}
    Answer questions strictly regarding diet, macros, supplements, and meal timing. Be empathetic but scientific. Do not provide medical advice. Keep your answers concise and easy to understand.`;

    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chat;
};

export const getNutritionistResponse = async (chat: Chat, history: ChatMessage[], newMessage: string): Promise<string> => {
    // The history is already managed by the Chat object, we just need to send the new message
    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
};