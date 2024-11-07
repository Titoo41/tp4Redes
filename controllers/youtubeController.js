// controllers/youtubeController.js
const { getYouTubeTrends } = require('../config/youtube');
const jwt = require('jsonwebtoken');

const fetchTrendsAndGenerateHashtags = async (req, res) => {
    try {
        const regionCode = 'AR'; // Código de región para Argentina
        const videoCategoryId = '20'; // ID de la categoría "Videojuegos"
        
        // Obtenemos las tendencias especificando los parámetros
        const trends = await getYouTubeTrends(regionCode, videoCategoryId); 

        // Ordenamos los videos por la cantidad de visualizaciones
        const sortedTrends = trends.sort((a, b) => {
            return (b.statistics.viewCount - a.statistics.viewCount); // Orden descendente
        });

        const response = sortedTrends.map(video => {
            const titleWords = video.snippet.title.split(' ');
            const hashtags = titleWords.slice(0, 5).map(word => `#${word.replace(/[^a-zA-Z0-9]/g, '')}`).join(' '); // Generamos los hashtags
            return {
                title: video.snippet.title,
                hashtags,
                viewCount: video.statistics.viewCount // Incluimos la cantidad de vistas
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
    // Aquí puedes agregar la lógica para autenticar al usuario.
    // En este ejemplo, usamos un objeto dummy para el usuario.
    const user = { id: 1, username: 'titimod' };

    // Generar el token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Devolver el token
    res.json({ token });
};

module.exports = { fetchTrendsAndGenerateHashtags, generateToken };
