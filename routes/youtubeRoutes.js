

const express = require('express');
const { fetchTrendsAndGenerateHashtags, saveYouTubeData } = require('../controllers/youtubeController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/trends', verifyToken, fetchTrendsAndGenerateHashtags);
router.post('/saveYouTubeData', verifyToken, saveYouTubeData);

module.exports = router;
