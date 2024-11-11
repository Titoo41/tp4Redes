const { getYouTubeTrends } = require('../config/youtube');
const jwt = require('jsonwebtoken');

const fetchTrendsAndGenerateHashtags = async (req, res) => {
    try {
        const regionCode = 'AR'; 
        const videoCategoryId = '20';
        // LA CATEGORIA NO FUNCIONA BIEN , PERO ES POR CONTEXTO HUMANO /// EXPLICAR ////
        
        
        const trends = await getYouTubeTrends(regionCode, videoCategoryId); 

        // ESTA FUNCION LA COPIE SUGERIDA ES PARA QUE NOS ORDENE LOS VIDEOS SEGUN VISTAS
        const sortedTrends = trends.sort((a, b) => {
            return (b.statistics.viewCount - a.statistics.viewCount); 
        });

        const response = sortedTrends.map(video => {
            const titleWords = video.snippet.title.split(' ');
            const hashtags = titleWords.slice(0, 5).map(word => `#${word.replace(/[^a-zA-Z0-9]/g, '')}`).join(' '); // Generamos los hashtags
            return {
                title: video.snippet.title,
                hashtags,
                viewCount: video.statistics.viewCount
            };
        });

        res.json({
            response: 'Aquí tienes algunas tendencias populares en Argentina: ',
            trends: response,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching trends or generating hashtags' });
    }
};

const generateToken = (req, res) => {
    const user = { id: 1, username: 'titimod' };
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

module.exports = { fetchTrendsAndGenerateHashtags, generateToken };



