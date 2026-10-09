const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authMiddleware } = require('../middleware/auth');

// Public
router.get('/', articleController.getArticles);
router.get('/categories', articleController.getArticleCategories);
router.get('/:slug', articleController.getArticleBySlug);

// Protected (Admin)
router.post('/', authMiddleware, articleController.createArticle);
router.put('/:id', authMiddleware, articleController.updateArticle);
router.delete('/:id', authMiddleware, articleController.deleteArticle);

module.exports = router;
