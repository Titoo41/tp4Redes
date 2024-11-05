// routes/youtubeRoutes.js
const express = require('express');
const { fetchTrendsAndGenerateHashtags, saveTrend } = require('../controllers/youtubeController');

const router = express.Router();

router.get('/trends', fetchTrendsAndGenerateHashtags);
router.post('/trends/save', saveTrend); // Nueva ruta para guardar tendencia

module.exports = router;
