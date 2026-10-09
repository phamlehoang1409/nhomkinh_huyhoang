const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authMiddleware } = require('../middleware/auth');

// Public
router.get('/', serviceController.getServices);
router.get('/featured', serviceController.getFeaturedServices);
router.get('/:slug', serviceController.getServiceBySlug);

// Protected (Admin)
router.post('/', authMiddleware, serviceController.createService);
router.put('/:id', authMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router;
