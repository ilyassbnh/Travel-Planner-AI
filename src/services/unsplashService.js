import axios from 'axios';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

/**
 * Fetches a high-quality landscape image for a given destination using the Unsplash API.
 * Falls back to a default premium image if the API key is missing, network fails, or no image is found.
 * 
 * @param {string} destination - The city or relevant search term
 * @returns {Promise<string>} - URL of the image
 */
export const fetchCityImage = async (destination) => {
    // Premium default fallback (Wooden boat / Mountains)
    const fallbackImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';

    if (!UNSPLASH_ACCESS_KEY) {
        console.warn("⚠️ Unsplash API Key (VITE_UNSPLASH_ACCESS_KEY) is missing. Using fallback image.");
        return fallbackImage;
    }

    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: `${destination} city landmark`,
                per_page: 1,
                orientation: 'landscape'
            },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0].urls.regular;
        }

        console.warn(`No Unsplash images found for: ${destination}. Using fallback.`);
        return fallbackImage;
    } catch (error) {
        console.error("❌ Error fetching image from Unsplash:", error);
        return fallbackImage;
    }
};
