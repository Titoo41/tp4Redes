// config/youtube.js
const axios = require('axios');

const getYouTubeTrends = async (regionCode = 'AR', maxResults = 5) => {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                chart: 'mostPopular',
                regionCode, // Ahora es 'AR' para Argentina
                maxResults, // Ahora solo se obtienen 5 resultados
                key: process.env.YOUTUBE_API_KEY,
            },
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching YouTube trends:', error.message);
        throw new Error('Error fetching YouTube trends');
    }
};

module.exports = { getYouTubeTrends };
