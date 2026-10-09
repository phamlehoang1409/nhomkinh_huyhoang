const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { quoteLimiter } = require('../middleware/rateLimiter');
const { honeypotCheck } = require('../middleware/security');

// Public submit (Rate limit 5req/30m + Honeypot + File upload max 3 files)
router.post('/', quoteLimiter, upload.array('images', 3), honeypotCheck, quoteController.createQuoteRequest);

// Protected (Admin)
router.get('/', authMiddleware, quoteController.getQuoteRequests);
router.put('/:id/status', authMiddleware, quoteController.updateQuoteStatus);
router.delete('/:id', authMiddleware, quoteController.deleteQuoteRequest);

module.exports = router;
