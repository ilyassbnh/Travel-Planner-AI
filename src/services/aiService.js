import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("ERREUR: La clé API Gemini est manquante.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateTripDescription = async (destination, budget) => {
  try {
    // --- CHANGEMENT ICI : On utilise un modèle plus récent et précis ---
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Agis comme un guide de voyage expert. Écris une description courte (max 3 phrases), accrocheuse et inspirante pour un voyage à ${destination} avec un budget de ${budget}€. Mentionne une activité clé.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "Impossible de générer la description (Erreur Model/API).";
  }
};