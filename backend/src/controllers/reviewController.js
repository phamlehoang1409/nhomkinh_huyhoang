const { query, isUsingFallback, getFallbackStore, saveFallbackData } = require('../config/db');

// Lấy danh sách đánh giá
async function getReviews(req, res) {
  try {
    if (isUsingFallback()) {
      const store = getFallbackStore();
      let list = [...store.reviews];
      if (req.query.all !== 'true') {
        list = list.filter(r => r.is_published === 1 || r.is_published === true);
      }
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
      return res.json({ success: true, data: list });
    }

    let sql = 'SELECT * FROM reviews WHERE is_published = 1 ORDER BY id DESC';
    if (req.query.all === 'true') {
      sql = 'SELECT * FROM reviews ORDER BY id DESC';
    }
    const rows = await query(sql);
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách đánh giá.' });
  }
}

// Thêm đánh giá
async function createReview(req, res) {
  try {
    const { customer_name, rating, comment, address_or_role, avatar, is_published } = req.body;

    if (!customer_name || !comment) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên và nội dung đánh giá.' });
    }

    const starRating = Math.max(1, Math.min(5, parseInt(rating || 5, 10)));

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const newId = store.reviews.length > 0 ? Math.max(...store.reviews.map(r => r.id)) + 1 : 1;
      const newRev = {
        id: newId,
        customer_name,
        rating: starRating,
        comment,
        address_or_role: address_or_role || 'Khách hàng tại Thanh Hóa',
        avatar: avatar || null,
        is_published: is_published !== undefined ? (is_published ? 1 : 0) : 1,
        created_at: new Date().toISOString()
      };
      store.reviews.unshift(newRev);
      saveFallbackData();
      return res.status(201).json({ success: true, message: 'Thêm đánh giá thành công.', data: newRev });
    }

    const sql = `
      INSERT INTO reviews (customer_name, rating, comment, address_or_role, avatar, is_published)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      customer_name,
      starRating,
      comment,
      address_or_role || 'Khách hàng tại Thanh Hóa',
      avatar || null,
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    ]);

    return res.status(201).json({
      success: true,
      message: 'Thêm đánh giá thành công.',
      data: { id: result.insertId }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi thêm đánh giá.' });
  }
}

// Cập nhật đánh giá (Admin)
async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const { customer_name, rating, comment, address_or_role, avatar, is_published } = req.body;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const idx = store.reviews.findIndex(r => Number(r.id) === Number(id));
      if (idx === -1) return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá.' });

      store.reviews[idx] = {
        ...store.reviews[idx],
        customer_name: customer_name || store.reviews[idx].customer_name,
        rating: rating !== undefined ? parseInt(rating, 10) : store.reviews[idx].rating,
        comment: comment || store.reviews[idx].comment,
        address_or_role: address_or_role !== undefined ? address_or_role : store.reviews[idx].address_or_role,
        avatar: avatar !== undefined ? avatar : store.reviews[idx].avatar,
        is_published: is_published !== undefined ? (is_published ? 1 : 0) : store.reviews[idx].is_published
      };
      saveFallbackData();
      return res.json({ success: true, message: 'Cập nhật đánh giá thành công.' });
    }

    const sql = `
      UPDATE reviews SET
        customer_name = ?, rating = ?, comment = ?, address_or_role = ?,
        avatar = ?, is_published = ?
      WHERE id = ?
    `;
    await query(sql, [
      customer_name,
      parseInt(rating || 5, 10),
      comment,
      address_or_role || null,
      avatar || null,
      is_published !== undefined ? (is_published ? 1 : 0) : 1,
      id
    ]);

    return res.json({ success: true, message: 'Cập nhật đánh giá thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật đánh giá.' });
  }
}

// Xóa đánh giá (Admin)
async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      store.reviews = store.reviews.filter(r => Number(r.id) !== Number(id));
      saveFallbackData();
      return res.json({ success: true, message: 'Đã xóa đánh giá.' });
    }

    await query('DELETE FROM reviews WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Đã xóa đánh giá thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa đánh giá.' });
  }
}

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview
};
