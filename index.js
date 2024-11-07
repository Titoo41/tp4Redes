// index.js
require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors'); // Importamos cors
const { getYouTubeTrends } = require('./config/youtube'); // Asegúrate de que esta línea esté presente
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/authMiddleware'); // Middleware para JWT

const app = express();
const port = process.env.PORT || 3000;

// Lógica para crear el token
const generateToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Configuración de CORS para permitir todas las solicitudes de origen cruzado
app.use(cors());

// Middleware para analizar JSON
app.use(express.json());

// Configuración de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint para login (Generar el token)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;  // Aquí deberías autenticar al usuario

    // Ejemplo de validación (cambiar según tu lógica de autenticación)
    if (username === 'titimod' && password === 'titimod') {
        const user = { id: 1, username };  // Crear un objeto de usuario
        const token = generateToken(user); // Generar el token
        res.json({ token });  // Enviar el token como respuesta
    } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
});

// Endpoint para interactuar con OpenAI
app.post('/api/openai', verifyToken, async (req, res) => {
    try {
        const { prompt } = req.body; // Recibimos el 'prompt' desde el cliente

        // Verificamos si el prompt está relacionado con tendencias de YouTube
        if (prompt.toLowerCase().includes('video sobre') || prompt.toLowerCase().includes('subir a youtube')) {
            const trends = await getYouTubeTrends(); // Obtenemos las tendencias

            // Generar respuesta con hashtags
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
            // Si el prompt no está relacionado, seguimos con la llamada a OpenAI
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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
