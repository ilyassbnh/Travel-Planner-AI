
// Use a relative path /webhook/... in development to trigger the Vite proxy
// In production, use the full URL from environment
const rawWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
const WEBHOOK_URL = import.meta.env.DEV
    ? new URL(rawWebhookUrl).pathname
    : rawWebhookUrl;

export const generateTripDescription = async (destination, budget, generateActivities = false) => {
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
                action: generateActivities ? 'generate_itinerary_and_activities' : 'generate_itinerary'
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur webhook n8n: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("RAW n8n response:", JSON.stringify(data, null, 2));

        // Handle n8n output formats
        let parsedDescription = '';
        let parsedActivities = [];

        if (data && data.description) {
            parsedDescription = data.description;
            if (data.activities && Array.isArray(data.activities)) {
                parsedActivities = data.activities;
            }
        } else if (typeof data === "string") {
            // Try to parse if it's a JSON string containing both
            try {
                const jsonObj = JSON.parse(data);
                if (jsonObj.description) {
                    parsedDescription = jsonObj.description;
                    if (jsonObj.activities) parsedActivities = jsonObj.activities;
                } else {
                    parsedDescription = data;
                }
            } catch (e) {
                parsedDescription = data;
            }
        } else if (data && typeof data === "object") {
            // Check if n8n returned an array of items
            if (Array.isArray(data) && data.length > 0) {
                if (data[0].description) {
                    parsedDescription = data[0].description;
                    if (data[0].activities) parsedActivities = data[0].activities;
                } else if (data[0].text) {
                    parsedDescription = data[0].text;
                }
            } else if (data.content && data.content.parts && data.content.parts.length > 0 && data.content.parts[0].text) {
                // Check if n8n returned the raw gemini data format
                let rawText = data.content.parts[0].text;
                try {
                    // Clean up markdown markers just in case Gemini wrapped the JSON
                    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                    const jsonObj = JSON.parse(rawText);
                    if (jsonObj.description) {
                        parsedDescription = jsonObj.description;
                        if (jsonObj.activities) parsedActivities = jsonObj.activities;
                    } else {
                        parsedDescription = rawText;
                    }
                } catch (e) {
                    console.error("Failed to parse inner JSON from Gemini:", e, "Raw text was:", rawText);
                    parsedDescription = rawText;
                }
            } else {
                console.warn("Returning raw object as string for description");
                parsedDescription = JSON.stringify(data);
            }
        } else {
            throw new Error("Format inattendu reçu de n8n");
        }

        return {
            description: parsedDescription,
            activities: parsedActivities
        };

    } catch (error) {
        console.error("Erreur avec l'intégration n8n:", error);
        console.warn("⚠️ Passage en mode Simulation (Fallback).");

        // Fallback simulation text
        return {
            description: `(Mode Hors-Ligne/Erreur) Préparez-vous à découvrir ${destination} ! Cette destination offre un mélange parfait de culture et de détente. Avec votre budget de ${budget}€, vous pourrez profiter des spécialités locales et des points de vue panoramiques. Ce voyage promet d'être inoubliable !`,
            activities: generateActivities ? [
                { name: "Balade au centre-ville", cost: 0, category: "Loisir" },
                { name: "Dîner typique", cost: budget * 0.1, category: "Restauration" }
            ] : []
        };
    }
};
