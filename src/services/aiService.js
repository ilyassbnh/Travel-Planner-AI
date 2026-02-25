import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("ERREUR: La clé API Gemini est manquante.");
}

// Keep the SDK initialized so if the project still needs it elsewhere it doesn't break
const genAI = new GoogleGenerativeAI(API_KEY);

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export const generateTripDescription = async (destination, budget) => {
    try {
        console.log(`🤖 Routing request through n8n Data Enrichment webhook: ${WEBHOOK_URL}`);

        if (!WEBHOOK_URL) {
            throw new Error("Missing VITE_N8N_WEBHOOK_URL in environment variables.");
        }

        // Sync API call to the hosted n8n webhook
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                destination,
                budget,
                apiKey: API_KEY
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur webhook n8n: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("RAW n8n response:", JSON.stringify(data, null, 2));

        // n8n's Set node output
        if (data && data.description) {
            return data.description;
        } else if (typeof data === "string") {
            return data;
        } else if (data && typeof data === "object") {
            // Check if n8n returned an array of items
            if (Array.isArray(data) && data.length > 0 && data[0].description) {
                return data[0].description;
            }
            // Check if n8n returned the raw gemini data format (current n8n Gemini node)
            if (data.content && data.content.parts && data.content.parts.length > 0 && data.content.parts[0].text) {
                return data.content.parts[0].text;
            }
            // Just return whatever stringified JSON we got as a last resort
            console.warn("Returning raw object as string");
            return JSON.stringify(data);
        }

        throw new Error("Format inattendu reçu de n8n");

    } catch (error) {
        console.error("Erreur avec l'intégration n8n:", error);
        console.warn("⚠️ Passage en mode Simulation (Fallback).");

        // Fallback simulation text
        return `(Mode Hors-Ligne/Erreur) Préparez-vous à découvrir ${destination} ! Cette destination offre un mélange parfait de culture et de détente. Avec votre budget de ${budget}€, vous pourrez profiter des spécialités locales et des points de vue panoramiques. Ce voyage promet d'être inoubliable !`;
    }
};
