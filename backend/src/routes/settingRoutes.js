const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authMiddleware } = require('../middleware/auth');

// Public read
router.get('/', settingController.getSettings);

// Protected (Admin)
router.put('/', authMiddleware, settingController.updateSettings);

module.exports = router;
