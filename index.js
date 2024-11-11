require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const { getYouTubeTrends } = require('./config/youtube'); 
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/authMiddleware'); 

const app = express();
const port = process.env.PORT || 3000;

// ACA CREO EL TOKEN 
const generateToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

app.use(cors());

// ESTA FUNCION REVISAR, SE AGREGO CUANDO NO DEVOLVIA LOS JSON EL POSTMAN
app.use(express.json());

// FUNCION DE OPENAI CON LA CLAVE DEL .ENV
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ENDPOINT PARA EL LOGIN DEL TOKEN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body; 

    // USUARIO Y CONTRASEÑA PARA NO OLVIDARME, VALIDACION DE LOS 2
    if (username === 'titimod' && password === 'titimod') {
        const user = { id: 1, username }; 
        const token = generateToken(user); 
        res.json({ token }); //RESPONDE CON EL TOKEN 
    } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
});

// ENDPOINT DE LA API DE OPENAI, 
app.post('/api/openai', verifyToken, async (req, res) => {
    try {
        const { prompt } = req.body; 

        // ESTA FUNCION LA SUGIRIO EL USUARIO DEL PROYECTO DE JAVASCRIPT VANILLA
        if (prompt.toLowerCase().includes('video sobre') || prompt.toLowerCase().includes('subir a youtube')) {
            const trends = await getYouTubeTrends(); 

            // ACA LE PEDI QUE ME DE HASTAGS DE LOS VIDEOS
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