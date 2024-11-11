const axios = require('axios');
//FUNCION PARA QUE LOS VIDEOS SEAN DE ARGENTINA Y QUE DEVUELVA SOLO 5
//TAMBIEN HABIAMOS AGREGADO LA CATEGORIA PERO NO FUNCIONABA


// EXPLICAR LO DE CATEGORIA


const getYouTubeTrends = async (regionCode = 'AR', maxResults = 5) => {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                chart: 'mostPopular',
                regionCode, 
                maxResults, 
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
