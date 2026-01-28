import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("ERREUR: La clé API Gemini est manquante.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateTripDescription = async (destination, budget) => {
    try {
        // Attempting to use the new experimental model as requested
        console.log("🤖 Initializing AI with model: gemini-1.5-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Agis comme un guide de voyage expert. Écris une description courte (max 3 phrases), accrocheuse et inspirante pour un voyage à ${destination} avec un budget de ${budget}€. Mentionne une activité clé.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Erreur Gemini (Model 3.0):", error);
        console.warn("⚠️ Passage en mode Simulation (Fallback).");

        // Fallback simulation text
        return `(Mode Hors-Ligne) Préparez-vous à découvrir ${destination} ! Cette destination offre un mélange parfait de culture et de détente. Avec votre budget de ${budget}€, vous pourrez profiter des spécialités locales et des points de vue panoramiques. Ce voyage promet d'être inoubliable !`;
    }
};
