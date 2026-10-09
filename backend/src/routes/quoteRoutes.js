const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { quoteLimiter } = require('../middleware/rateLimiter');

// Public submit (with optional multiple image upload & rate limiting)
router.post('/', quoteLimiter, upload.array('images', 5), quoteController.createQuoteRequest);

// Protected (Admin)
router.get('/', authMiddleware, quoteController.getQuoteRequests);
router.put('/:id/status', authMiddleware, quoteController.updateQuoteStatus);
router.delete('/:id', authMiddleware, quoteController.deleteQuoteRequest);

module.exports = router;
