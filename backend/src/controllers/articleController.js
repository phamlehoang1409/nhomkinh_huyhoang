const { query, isUsingFallback, getFallbackStore, saveFallbackData } = require('../config/db');
const { createSlug } = require('../utils/slug');

// Lấy danh sách bài viết
async function getArticles(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '9', 10)));
    const categoryId = req.query.category_id ? parseInt(req.query.category_id, 10) : null;
    const search = (req.query.search || '').trim().toLowerCase();

    if (isUsingFallback()) {
      const store = getFallbackStore();
      let list = [...store.articles];

      if (req.query.all !== 'true') {
        list = list.filter(a => a.is_published === 1 || a.is_published === true);
      }

      if (categoryId) {
        list = list.filter(a => Number(a.category_id) === categoryId);
      }

      if (search) {
        list = list.filter(a =>
          (a.title && a.title.toLowerCase().includes(search)) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(search)) ||
          (a.content && a.content.toLowerCase().includes(search))
        );
      }

      list.sort((a, b) => (b.id || 0) - (a.id || 0));

      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const offset = (page - 1) * limit;
      const paginated = list.slice(offset, offset + limit).map(a => {
        const cat = store.article_categories.find(c => Number(c.id) === Number(a.category_id));
        return {
          ...a,
          category_name: cat ? cat.name : null,
          category_slug: cat ? cat.slug : null
        };
      });

      return res.json({
        success: true,
        data: paginated,
        pagination: { page, limit, total, totalPages }
      });
    }

    let whereClauses = [];
    let params = [];

    if (req.query.all !== 'true') {
      whereClauses.push('a.is_published = 1');
    }

    if (categoryId) {
      whereClauses.push('a.category_id = ?');
      params.push(categoryId);
    }

    if (search) {
      whereClauses.push('(LOWER(a.title) LIKE ? OR LOWER(a.excerpt) LIKE ? OR LOWER(a.content) LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as total FROM articles a ${whereSql}`;
    const countResult = await query(countSql, params);
    const total = countResult[0] ? countResult[0].total : 0;
    const totalPages = Math.ceil(total / limit) || 1;

    const offset = (page - 1) * limit;
    const dataSql = `
      SELECT a.*, c.name as category_name, c.slug as category_slug
      FROM articles a
      LEFT JOIN article_categories c ON a.category_id = c.id
      ${whereSql}
      ORDER BY a.id DESC
      LIMIT ? OFFSET ?
    `;
    const rows = await query(dataSql, [...params, limit, offset]);

    return res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total, totalPages }
    });
  } catch (error) {
    console.error('getArticles error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách bài viết.' });
  }
}

// Lấy danh mục bài viết
async function getArticleCategories(req, res) {
  try {
    if (isUsingFallback()) {
      const store = getFallbackStore();
      return res.json({ success: true, data: store.article_categories });
    }
    const rows = await query('SELECT * FROM article_categories ORDER BY id ASC');
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh mục bài viết.' });
  }
}

// Lấy chi tiết bài viết theo Slug
async function getArticleBySlug(req, res) {
  try {
    const { slug } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const article = store.articles.find(a => a.slug === slug);
      if (!article) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });

      article.views = (article.views || 0) + 1;
      saveFallbackData();

      const cat = store.article_categories.find(c => Number(c.id) === Number(article.category_id));
      return res.json({
        success: true,
        data: {
          ...article,
          category_name: cat ? cat.name : null,
          category_slug: cat ? cat.slug : null
        }
      });
    }

    const rows = await query(`
      SELECT a.*, c.name as category_name, c.slug as category_slug
      FROM articles a
      LEFT JOIN article_categories c ON a.category_id = c.id
      WHERE a.slug = ?
      LIMIT 1
    `, [slug]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
    }

    // Increment views
    await query('UPDATE articles SET views = views + 1 WHERE id = ?', [rows[0].id]);
    rows[0].views += 1;

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải chi tiết bài viết.' });
  }
}

// Thêm bài viết (Admin)
async function createArticle(req, res) {
  try {
    const { title, category_id, excerpt, content, thumbnail, author, is_published } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Tiêu đề bài viết không được để trống.' });
    }

    const slug = createSlug(title);

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const newId = store.articles.length > 0 ? Math.max(...store.articles.map(a => a.id)) + 1 : 1;
      const newArticle = {
        id: newId,
        title,
        slug,
        category_id: category_id ? parseInt(category_id, 10) : null,
        excerpt: excerpt || null,
        content: content || null,
        thumbnail: thumbnail || null,
        author: author || 'Nhôm Kính Huy Hoàng',
        views: 0,
        is_published: is_published !== undefined ? (is_published ? 1 : 0) : 1,
        created_at: new Date().toISOString()
      };
      store.articles.unshift(newArticle);
      saveFallbackData();
      return res.status(201).json({ success: true, message: 'Thêm bài viết thành công.', data: newArticle });
    }

    const sql = `
      INSERT INTO articles (title, slug, category_id, excerpt, content, thumbnail, author, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      title,
      slug,
      category_id || null,
      excerpt || null,
      content || null,
      thumbnail || null,
      author || 'Nhôm Kính Huy Hoàng',
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    ]);

    return res.status(201).json({
      success: true,
      message: 'Thêm bài viết thành công.',
      data: { id: result.insertId, title, slug }
    });
  } catch (error) {
    console.error('createArticle error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi tạo bài viết.' });
  }
}

// Cập nhật bài viết (Admin)
async function updateArticle(req, res) {
  try {
    const { id } = req.params;
    const { title, category_id, excerpt, content, thumbnail, author, is_published } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Tiêu đề không được để trống.' });
    }

    const slug = createSlug(title);

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const index = store.articles.findIndex(a => Number(a.id) === Number(id));
      if (index === -1) return res.status(404).json({ success: false, message: 'Bài viết không tồn tại.' });

      store.articles[index] = {
        ...store.articles[index],
        title,
        slug,
        category_id: category_id !== undefined ? parseInt(category_id, 10) : store.articles[index].category_id,
        excerpt: excerpt !== undefined ? excerpt : store.articles[index].excerpt,
        content: content !== undefined ? content : store.articles[index].content,
        thumbnail: thumbnail !== undefined ? thumbnail : store.articles[index].thumbnail,
        author: author || store.articles[index].author,
        is_published: is_published !== undefined ? (is_published ? 1 : 0) : store.articles[index].is_published,
        updated_at: new Date().toISOString()
      };
      saveFallbackData();
      return res.json({ success: true, message: 'Cập nhật bài viết thành công.', data: store.articles[index] });
    }

    const sql = `
      UPDATE articles SET
        title = ?, slug = ?, category_id = ?, excerpt = ?, content = ?,
        thumbnail = ?, author = ?, is_published = ?
      WHERE id = ?
    `;
    await query(sql, [
      title,
      slug,
      category_id || null,
      excerpt || null,
      content || null,
      thumbnail || null,
      author || 'Nhôm Kính Huy Hoàng',
      is_published !== undefined ? (is_published ? 1 : 0) : 1,
      id
    ]);

    return res.json({ success: true, message: 'Cập nhật bài viết thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật bài viết.' });
  }
}

// Xóa bài viết (Admin)
async function deleteArticle(req, res) {
  try {
    const { id } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      store.articles = store.articles.filter(a => Number(a.id) !== Number(id));
      saveFallbackData();
      return res.json({ success: true, message: 'Đã xóa bài viết.' });
    }

    await query('DELETE FROM articles WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Đã xóa bài viết thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa bài viết.' });
  }
}

module.exports = {
  getArticles,
  getArticleCategories,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle
};
