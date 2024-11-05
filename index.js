// index.js
require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const youtubeRoutes = require('./routes/youtubeRoutes'); // Importamos las rutas de YouTube
const { getYouTubeTrends } = require('./config/youtube'); // Asegúrate de importar getYouTubeTrends

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use('/api/youtube', youtubeRoutes); // Usamos las rutas de YouTube

// Endpoint para interactuar con OpenAI
app.post('/api/openai', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (prompt.toLowerCase().includes('video sobre') || prompt.toLowerCase().includes('subir a youtube')) {
            const trends = await getYouTubeTrends();

            const response = trends.map(video => {
                const titleWords = video.snippet.title.split(' ');
                const hashtags = titleWords.slice(0, 5).map(word => `#${word.replace(/[^a-zA-Z0-9]/g, '')}`);
                return {
                    title: video.snippet.title,
                    description: video.snippet.description,
                    hashtags,
                };
            });

            res.json({
                response: `Aquí tienes algunas tendencias que podrías considerar para tu próximo video:`,
                trends: response,
            });
        } else {
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "Debes comportarte como el mejor asistente de streamer. Proporciona información sobre tendencias de YouTube y sugiere hashtags relevantes." },
                    { role: "user", content: prompt }
                ],
            });
            res.json({ response: completion.choices[0].message.content });
        }
    } catch (error) {
        console.error("Error en la solicitud a OpenAI:", error);
        res.status(500).json({ error: "Error en la solicitud a OpenAI", details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
