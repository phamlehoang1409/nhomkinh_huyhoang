const { query, isUsingFallback, getFallbackStore } = require('../config/db');

// Lấy số liệu thống kê Dashboard Admin
async function getDashboardStats(req, res) {
  try {
    if (isUsingFallback()) {
      const store = getFallbackStore();
      const quoteTotal = store.quote_requests.length;
      const quoteNew = store.quote_requests.filter(q => q.status === 'new').length;
      const quoteContacted = store.quote_requests.filter(q => q.status === 'contacted').length;
      const quoteQuoted = store.quote_requests.filter(q => q.status === 'quoted').length;
      const quoteCompleted = store.quote_requests.filter(q => q.status === 'completed').length;
      const quoteCancelled = store.quote_requests.filter(q => q.status === 'cancelled').length;

      const recentQuotes = [...store.quote_requests].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 6);

      return res.json({
        success: true,
        data: {
          productsCount: store.products.length,
          categoriesCount: store.categories.length,
          servicesCount: store.services.length,
          projectsCount: store.projects.length,
          articlesCount: store.articles.length,
          reviewsCount: store.reviews.length,
          quotes: {
            total: quoteTotal,
            new: quoteNew,
            contacted: quoteContacted,
            quoted: quoteQuoted,
            completed: quoteCompleted,
            cancelled: quoteCancelled
          },
          recentQuotes
        }
      });
    }

    const [prodCount] = await query('SELECT COUNT(*) as count FROM products');
    const [catCount] = await query('SELECT COUNT(*) as count FROM categories');
    const [servCount] = await query('SELECT COUNT(*) as count FROM services');
    const [projCount] = await query('SELECT COUNT(*) as count FROM projects');
    const [artCount] = await query('SELECT COUNT(*) as count FROM articles');
    const [revCount] = await query('SELECT COUNT(*) as count FROM reviews');

    const [quoteTotal] = await query('SELECT COUNT(*) as count FROM quote_requests');
    const [quoteNew] = await query('SELECT COUNT(*) as count FROM quote_requests WHERE status = "new"');
    const [quoteContacted] = await query('SELECT COUNT(*) as count FROM quote_requests WHERE status = "contacted"');
    const [quoteQuoted] = await query('SELECT COUNT(*) as count FROM quote_requests WHERE status = "quoted"');
    const [quoteCompleted] = await query('SELECT COUNT(*) as count FROM quote_requests WHERE status = "completed"');
    const [quoteCancelled] = await query('SELECT COUNT(*) as count FROM quote_requests WHERE status = "cancelled"');

    const recentQuotes = await query('SELECT * FROM quote_requests ORDER BY id DESC LIMIT 6');

    return res.json({
      success: true,
      data: {
        productsCount: prodCount ? prodCount.count : 0,
        categoriesCount: catCount ? catCount.count : 0,
        servicesCount: servCount ? servCount.count : 0,
        projectsCount: projCount ? projCount.count : 0,
        articlesCount: artCount ? artCount.count : 0,
        reviewsCount: revCount ? revCount.count : 0,
        quotes: {
          total: quoteTotal ? quoteTotal.count : 0,
          new: quoteNew ? quoteNew.count : 0,
          contacted: quoteContacted ? quoteContacted.count : 0,
          quoted: quoteQuoted ? quoteQuoted.count : 0,
          completed: quoteCompleted ? quoteCompleted.count : 0,
          cancelled: quoteCancelled ? quoteCancelled.count : 0
        },
        recentQuotes
      }
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải dữ liệu thống kê.' });
  }
}

module.exports = {
  getDashboardStats
};
