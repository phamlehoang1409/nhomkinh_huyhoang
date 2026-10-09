const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/auth');

// Public
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/similar/:id', productController.getSimilarProducts);
router.get('/:slug', productController.getProductBySlug);

// Protected (Admin)
router.post('/', authMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
