/* controllers/youtubeController.js
const { getYouTubeTrends } = require('../config/youtube');

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

module.exports = { fetchTrendsAndGenerateHashtags };*/

// controllers/youtubeController.js
const { getYouTubeTrends } = require('../config/youtube');
const pool = require('../config/db'); // Importamos la conexión a la base de datos

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
                videoId: video.id,
                title: video.snippet.title,
                hashtags,
                viewCount: video.statistics.viewCount, // Incluimos la cantidad de vistas
                description: video.snippet.description
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

/* Nueva función para guardar una tendencia seleccionada en la base de datos
const saveTrend = async (req, res) => {
    const { videoId, title, hashtags, viewCount, description } = req.body;
    try {
        const query = `INSERT INTO trends (video_id, title, hashtags, view_count, description) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [videoId, title, hashtags, viewCount, description];
        const result = await pool.query(query, values);
        res.json({ message: 'Tendencia guardada exitosamente', trend: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la tendencia', details: error.message });
    }
};*/
// Nueva función para guardar una tendencia seleccionada en la base de datos
const saveTrend = async (req, res) => {
    const { title, hashtags, description } = req.body; // Eliminamos videoId y viewCount
    try {
        const query = `INSERT INTO trends (title, hashtags, description) VALUES ($1, $2, $3) RETURNING *`; // Actualizamos la consulta
        const values = [title, hashtags, description]; // Eliminamos videoId y viewCount
        const result = await pool.query(query, values);
        res.json({ message: 'Tendencia guardada exitosamente', trend: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la tendencia', details: error.message });
    }
};


module.exports = { fetchTrendsAndGenerateHashtags, saveTrend };

