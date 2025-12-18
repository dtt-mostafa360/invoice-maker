
import { GoogleGenAI, Type } from "@google/genai";
import { InvoiceData } from "../types";

export const extractInvoiceData = async (base64Image: string): Promise<Partial<InvoiceData>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Extract all visible invoice data from this image. Map it to the provided JSON structure.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          senderName: { type: Type.STRING },
          senderAddress: { type: Type.STRING },
          billToName: { type: Type.STRING },
          billToAddress: { type: Type.STRING },
          invoiceNumber: { type: Type.STRING },
          dueDate: { type: Type.STRING },
          bankDetails: {
            type: Type.OBJECT,
            properties: {
              beneficiaryName: { type: Type.STRING },
              accountNumber: { type: Type.STRING },
              swiftNumber: { type: Type.STRING },
              beneficiaryAddress: { type: Type.STRING },
              bankName: { type: Type.STRING },
              bankAddress: { type: Type.STRING },
            },
          },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                qty: { type: Type.NUMBER },
                unitPrice: { type: Type.NUMBER },
              },
            },
          },
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return {};
  }
};
