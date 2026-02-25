/**
 * Service to interact with n8n Webhooks
 */

/**
 * Sends trip details to the n8n webhook for automation (email, etc.)
 * @param {Object} tripData - The trip details
 * @returns {Promise<void>}
 */
export const sendTripToWebhook = async ({ tripData, activities, email }) => {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('n8n Webhook URL is not defined in .env');
        return;
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                trip: tripData,
                activities: activities || [],
                email: email,
                timestamp: new Date().toISOString(),
                source: 'Travel Planner AI App'
            }),
        });

        if (!response.ok) {
            throw new Error(`n8n webhook failed: ${response.statusText}`);
        }

        console.log('Trip data successfully sent to n8n');
    } catch (error) {
        console.error('Error sending data to n8n:', error);
        // We do not throw here to prevent blocking the UI flow if automation fails
    }
};
