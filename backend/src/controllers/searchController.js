const { query, isUsingFallback, getFallbackStore } = require('../config/db');

// Tìm kiếm tổng hợp (Sản phẩm, Dịch vụ, Bài viết)
async function searchAll(req, res) {
  try {
    const q = (req.query.q || req.query.keyword || '').trim().toLowerCase();
    const type = req.query.type || 'all'; // all, products, services, articles
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '12', 10)));

    if (!q) {
      return res.json({
        success: true,
        data: {
          products: [],
          services: [],
          articles: [],
          totalResults: 0
        },
        pagination: { page: 1, limit, total: 0, totalPages: 1 }
      });
    }

    if (isUsingFallback()) {
      const store = getFallbackStore();
      
      let matchedProducts = [];
      let matchedServices = [];
      let matchedArticles = [];

      if (type === 'all' || type === 'products') {
        matchedProducts = store.products.filter(p =>
          (p.is_active === 1 || p.is_active === true) &&
          ((p.name && p.name.toLowerCase().includes(q)) ||
           (p.code && p.code.toLowerCase().includes(q)) ||
           (p.description && p.description.toLowerCase().includes(q)))
        );
      }

      if (type === 'all' || type === 'services') {
        matchedServices = store.services.filter(s =>
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.short_desc && s.short_desc.toLowerCase().includes(q)) ||
          (s.content && s.content.toLowerCase().includes(q))
        );
      }

      if (type === 'all' || type === 'articles') {
        matchedArticles = store.articles.filter(a =>
          (a.is_published === 1 || a.is_published === true) &&
          ((a.title && a.title.toLowerCase().includes(q)) ||
           (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
           (a.content && a.content.toLowerCase().includes(q)))
        );
      }

      const totalResults = matchedProducts.length + matchedServices.length + matchedArticles.length;

      return res.json({
        success: true,
        query: q,
        data: {
          products: matchedProducts,
          services: matchedServices,
          articles: matchedArticles,
          totalResults
        },
        pagination: {
          page,
          limit,
          total: totalResults,
          totalPages: Math.ceil(totalResults / limit) || 1
        }
      });
    }

    // MySQL Implementation
    const searchParam = `%${q}%`;

    let products = [];
    let services = [];
    let articles = [];

    if (type === 'all' || type === 'products') {
      products = await query(`
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = 1 AND (LOWER(p.name) LIKE ? OR LOWER(p.code) LIKE ? OR LOWER(p.description) LIKE ?)
        ORDER BY p.id DESC
        LIMIT 20
      `, [searchParam, searchParam, searchParam]);
    }

    if (type === 'all' || type === 'services') {
      services = await query(`
        SELECT * FROM services
        WHERE LOWER(name) LIKE ? OR LOWER(short_desc) LIKE ? OR LOWER(content) LIKE ?
        ORDER BY id DESC
        LIMIT 20
      `, [searchParam, searchParam, searchParam]);
    }

    if (type === 'all' || type === 'articles') {
      articles = await query(`
        SELECT a.*, c.name as category_name, c.slug as category_slug
        FROM articles a
        LEFT JOIN article_categories c ON a.category_id = c.id
        WHERE a.is_published = 1 AND (LOWER(a.title) LIKE ? OR LOWER(a.excerpt) LIKE ? OR LOWER(a.content) LIKE ?)
        ORDER BY a.id DESC
        LIMIT 20
      `, [searchParam, searchParam, searchParam]);
    }

    const totalResults = products.length + services.length + articles.length;

    return res.json({
      success: true,
      query: q,
      data: {
        products,
        services,
        articles,
        totalResults
      },
      pagination: {
        page,
        limit,
        total: totalResults,
        totalPages: Math.ceil(totalResults / limit) || 1
      }
    });
  } catch (error) {
    console.error('searchAll error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi thực hiện tìm kiếm.' });
  }
}

module.exports = {
  searchAll
};
