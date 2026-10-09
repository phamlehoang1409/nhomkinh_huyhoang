const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { searchLimiter } = require('../middleware/rateLimiter');

router.get('/', searchLimiter, searchController.searchAll);

module.exports = router;
