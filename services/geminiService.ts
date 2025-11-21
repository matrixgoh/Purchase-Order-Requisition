import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FormData } from "../types";

// Define the response schema for the AI to ensure we get valid JSON that matches our form structure
const formSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    deptTrackingNo: { type: Type.STRING },
    branch: { type: Type.STRING },
    dept: { type: Type.STRING },
    requestorName: { type: Type.STRING },
    vendorCode: { type: Type.STRING },
    vendorDetails: { type: Type.STRING },
    lineItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unitPrice: { type: Type.NUMBER },
        },
        required: ["description", "quantity", "unitPrice"],
      },
    },
    spoNo: { type: Type.STRING },
  },
  required: ["branch", "dept", "lineItems"],
};

export const generateFormData = async (prompt: string): Promise<Partial<FormData>> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment settings.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a procurement assistant helping to fill out a 'Purchase Order Requisition' form.
      Based on the following user request, generate the JSON data to fill the form.
      User Request: "${prompt}"
      
      If specific details (like names, codes) are missing, generate realistic placeholder data relevant to the request context (e.g., general office supplies for Quantum Global Solutions).
      For 'vendorDetails', formatted it as Name \n Address.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: formSchema,
        temperature: 0.3, 
      },
    });

    const text = response.text;
    if (!text) return {};

    const data = JSON.parse(text);
    
    // Map the AI response to our internal structure, adding IDs to line items
    const mappedData: Partial<FormData> = {
        ...data,
        lineItems: data.lineItems?.map((item: any, index: number) => ({
            ...item,
            id: `ai-${Date.now()}-${index}`
        })) || []
    };

    return mappedData;

  } catch (error) {
    console.error("Error generating form data:", error);
    throw error;
  }
};