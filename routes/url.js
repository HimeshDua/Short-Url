const express = require('express');
const {
  handleGeneratNewShortURL,
  handleGetAnalytics,
} = require('../controllers/url');
const router = express.Router();

router.post('/', handleGeneratNewShortURL);

router.get('/analytics/:shortId', handleGetAnalytics);

module.exports = router;
