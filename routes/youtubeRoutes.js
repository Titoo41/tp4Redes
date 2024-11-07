// routes/youtubeRoutes.js
const express = require('express');
const { fetchTrendsAndGenerateHashtags } = require('../controllers/youtubeController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Agregar el middleware JWT a las rutas protegidas
router.get('/trends', verifyToken, fetchTrendsAndGenerateHashtags);

module.exports = router;
