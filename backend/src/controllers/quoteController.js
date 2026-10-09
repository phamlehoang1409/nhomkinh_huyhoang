const { query, isUsingFallback, getFallbackStore, saveFallbackData } = require('../config/db');
const { isValidVNPhone } = require('../utils/phoneValidator');

// Khách hàng gửi yêu cầu tư vấn & báo giá
async function createQuoteRequest(req, res) {
  try {
    const { customer_name, phone, address, service_name, dimensions, note } = req.body;

    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập họ và tên của bạn.'
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập số điện thoại liên hệ.'
      });
    }

    if (!isValidVNPhone(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không đúng định dạng Việt Nam (ví dụ: 0978398567 hoặc 0912345678).'
      });
    }

    // Collect uploaded image URLs if any
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(f => `/uploads/${f.filename}`);
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const newId = store.quote_requests.length > 0 ? Math.max(...store.quote_requests.map(q => q.id)) + 1 : 1;
      const newQuote = {
        id: newId,
        customer_name: customer_name.trim(),
        phone: phone.trim(),
        address: address ? address.trim() : null,
        service_name: service_name ? service_name.trim() : null,
        dimensions: dimensions ? dimensions.trim() : null,
        note: note ? note.trim() : null,
        status: 'new',
        admin_note: null,
        created_at: new Date().toISOString(),
        images: imageUrls
      };

      store.quote_requests.unshift(newQuote);
      imageUrls.forEach((url, idx) => {
        store.quote_request_images.push({
          id: (store.quote_request_images.length || 0) + idx + 1,
          quote_request_id: newId,
          image_url: url,
          created_at: new Date().toISOString()
        });
      });

      saveFallbackData();

      return res.status(201).json({
        success: true,
        message: 'Gửi yêu cầu báo giá thành công! Nhôm Kính Huy Hoàng sẽ liên hệ tư vấn quý khách trong thời gian sớm nhất.',
        data: { id: newId }
      });
    }

    // MySQL Insert
    const sql = `
      INSERT INTO quote_requests (customer_name, phone, address, service_name, dimensions, note, status)
      VALUES (?, ?, ?, ?, ?, ?, 'new')
    `;
    const result = await query(sql, [
      customer_name.trim(),
      phone.trim(),
      address ? address.trim() : null,
      service_name ? service_name.trim() : null,
      dimensions ? dimensions.trim() : null,
      note ? note.trim() : null
    ]);

    const quoteId = result.insertId;

    if (imageUrls.length > 0) {
      for (const imgUrl of imageUrls) {
        await query(
          'INSERT INTO quote_request_images (quote_request_id, image_url) VALUES (?, ?)',
          [quoteId, imgUrl]
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Gửi yêu cầu báo giá thành công! Nhôm Kính Huy Hoàng sẽ liên hệ tư vấn quý khách trong thời gian sớm nhất.',
      data: { id: quoteId }
    });
  } catch (error) {
    console.error('createQuoteRequest error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi lưu yêu cầu báo giá. Quý khách vui lòng gọi trực tiếp Hotline 0978398567 để được hỗ trợ ngay.'
    });
  }
}

// Lấy danh sách yêu cầu báo giá (Admin)
async function getQuoteRequests(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '15', 10)));
    const status = req.query.status || '';
    const search = (req.query.search || '').trim().toLowerCase();

    if (isUsingFallback()) {
      const store = getFallbackStore();
      let list = [...store.quote_requests];

      if (status && status !== 'all') {
        list = list.filter(q => q.status === status);
      }

      if (search) {
        list = list.filter(q =>
          (q.customer_name && q.customer_name.toLowerCase().includes(search)) ||
          (q.phone && q.phone.includes(search)) ||
          (q.address && q.address.toLowerCase().includes(search)) ||
          (q.service_name && q.service_name.toLowerCase().includes(search))
        );
      }

      list.sort((a, b) => (b.id || 0) - (a.id || 0));

      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const offset = (page - 1) * limit;
      const paginated = list.slice(offset, offset + limit).map(q => {
        const imgs = store.quote_request_images
          .filter(img => Number(img.quote_request_id) === Number(q.id))
          .map(img => img.image_url);
        return {
          ...q,
          images: imgs.length > 0 ? imgs : (q.images || [])
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

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      params.push(status);
    }

    if (search) {
      whereClauses.push('(LOWER(customer_name) LIKE ? OR phone LIKE ? OR LOWER(address) LIKE ? OR LOWER(service_name) LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as total FROM quote_requests ${whereSql}`;
    const countResult = await query(countSql, params);
    const total = countResult[0] ? countResult[0].total : 0;
    const totalPages = Math.ceil(total / limit) || 1;

    const offset = (page - 1) * limit;
    const dataSql = `SELECT * FROM quote_requests ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`;
    const rows = await query(dataSql, [...params, limit, offset]);

    // Attach images
    for (const r of rows) {
      const imgs = await query('SELECT image_url FROM quote_request_images WHERE quote_request_id = ?', [r.id]);
      r.images = imgs.map(i => i.image_url);
    }

    return res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total, totalPages }
    });
  } catch (error) {
    console.error('getQuoteRequests error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách yêu cầu báo giá.' });
  }
}

// Cập nhật trạng thái yêu cầu báo giá (Admin)
async function updateQuoteStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, admin_note } = req.body;

    const validStatuses = ['new', 'contacted', 'quoted', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
    }

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const item = store.quote_requests.find(q => Number(q.id) === Number(id));
      if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu báo giá.' });

      if (status) item.status = status;
      if (admin_note !== undefined) item.admin_note = admin_note;
      item.updated_at = new Date().toISOString();
      saveFallbackData();

      return res.json({ success: true, message: 'Cập nhật trạng thái thành công.', data: item });
    }

    let updates = [];
    let params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (admin_note !== undefined) {
      updates.push('admin_note = ?');
      params.push(admin_note);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có dữ liệu cập nhật.' });
    }

    params.push(id);
    await query(`UPDATE quote_requests SET ${updates.join(', ')} WHERE id = ?`, params);

    return res.json({ success: true, message: 'Cập nhật trạng thái thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật yêu cầu báo giá.' });
  }
}

// Xóa yêu cầu báo giá (Admin)
async function deleteQuoteRequest(req, res) {
  try {
    const { id } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      store.quote_requests = store.quote_requests.filter(q => Number(q.id) !== Number(id));
      store.quote_request_images = store.quote_request_images.filter(i => Number(i.quote_request_id) !== Number(id));
      saveFallbackData();
      return res.json({ success: true, message: 'Đã xóa yêu cầu báo giá.' });
    }

    await query('DELETE FROM quote_requests WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Đã xóa yêu cầu báo giá thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa yêu cầu.' });
  }
}

module.exports = {
  createQuoteRequest,
  getQuoteRequests,
  updateQuoteStatus,
  deleteQuoteRequest
};
