const rawText = `{"content":{"parts":[{"text":"{\\n  \\"description\\": \\"Plongez au cœur de la Ville.\\",\\n  \\"activities\\": [\\n    {\\n      \\"name\\": \\"Hébergement\\",\\n      \\"category\\": \\"Logement\\",\\n      \\"cost\\": 650\\n    }\\n  ]\\n}","thoughtSignature":"xyz"}],"role":"model"},"finishReason":"STOP","index":0}`;

const data = JSON.parse(rawText);

let parsedDescription = '';
let parsedActivities = [];

if (data && typeof data === "object") {
    // Check if n8n returned an array of items
    if (Array.isArray(data) && data.length > 0) {
        console.log("data is array");
    } else if (data.content && data.content.parts && data.content.parts.length > 0 && data.content.parts[0].text) {
        console.log("found gemini format");
        const rawText = data.content.parts[0].text;
        try {
            const jsonObj = JSON.parse(rawText);
            if (jsonObj.description) {
                parsedDescription = jsonObj.description;
                if (jsonObj.activities) parsedActivities = jsonObj.activities;
            } else {
                parsedDescription = rawText;
            }
        } catch (e) {
            console.error("error parsing inside gemini block", e);
            parsedDescription = rawText;
        }
    } else {
        console.warn("Returning raw object as string for description");
        parsedDescription = JSON.stringify(data);
    }
}

console.log("description:", parsedDescription);
