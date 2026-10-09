const { query, isUsingFallback, getFallbackStore, saveFallbackData } = require('../config/db');
const { createSlug } = require('../utils/slug');

// Lấy danh sách dịch vụ
async function getServices(req, res) {
  try {
    if (isUsingFallback()) {
      const store = getFallbackStore();
      const list = [...store.services].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map(s => ({
        ...s,
        benefits: typeof s.benefits === 'string' ? JSON.parse(s.benefits || '[]') : s.benefits
      }));
      return res.json({ success: true, data: list });
    }

    const sql = 'SELECT * FROM services ORDER BY display_order ASC, id ASC';
    const rows = await query(sql);
    const formatted = rows.map(s => ({
      ...s,
      benefits: typeof s.benefits === 'string' ? JSON.parse(s.benefits || '[]') : s.benefits
    }));
    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('getServices error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách dịch vụ.' });
  }
}

// Lấy dịch vụ nổi bật cho trang chủ
async function getFeaturedServices(req, res) {
  try {
    if (isUsingFallback()) {
      const store = getFallbackStore();
      const list = store.services
        .filter(s => s.is_featured === 1 || s.is_featured === true)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map(s => ({
          ...s,
          benefits: typeof s.benefits === 'string' ? JSON.parse(s.benefits || '[]') : s.benefits
        }));
      return res.json({ success: true, data: list });
    }

    const sql = 'SELECT * FROM services WHERE is_featured = 1 ORDER BY display_order ASC';
    const rows = await query(sql);
    const formatted = rows.map(s => ({
      ...s,
      benefits: typeof s.benefits === 'string' ? JSON.parse(s.benefits || '[]') : s.benefits
    }));
    return res.json({ success: true, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải dịch vụ nổi bật.' });
  }
}

// Lấy chi tiết dịch vụ theo Slug
async function getServiceBySlug(req, res) {
  try {
    const { slug } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const item = store.services.find(s => s.slug === slug);
      if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy dịch vụ.' });
      return res.json({
        success: true,
        data: {
          ...item,
          benefits: typeof item.benefits === 'string' ? JSON.parse(item.benefits || '[]') : item.benefits
        }
      });
    }

    const rows = await query('SELECT * FROM services WHERE slug = ? LIMIT 1', [slug]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dịch vụ.' });
    }

    const item = rows[0];
    return res.json({
      success: true,
      data: {
        ...item,
        benefits: typeof item.benefits === 'string' ? JSON.parse(item.benefits || '[]') : item.benefits
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải chi tiết dịch vụ.' });
  }
}

// Thêm mới dịch vụ (Admin)
async function createService(req, res) {
  try {
    const { name, short_desc, content, icon, image, benefits, display_order, is_featured } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên dịch vụ không được để trống.' });
    }

    const slug = createSlug(name);
    const benefitsStr = Array.isArray(benefits) ? JSON.stringify(benefits) : (benefits || '[]');

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const newId = store.services.length > 0 ? Math.max(...store.services.map(s => s.id)) + 1 : 1;
      const newService = {
        id: newId,
        name,
        slug,
        short_desc: short_desc || null,
        content: content || null,
        icon: icon || 'Wrench',
        image: image || null,
        benefits: benefitsStr,
        display_order: parseInt(display_order || 0, 10),
        is_featured: is_featured ? 1 : 0,
        created_at: new Date().toISOString()
      };
      store.services.push(newService);
      saveFallbackData();
      return res.status(201).json({ success: true, message: 'Thêm dịch vụ thành công.', data: newService });
    }

    const sql = `
      INSERT INTO services (name, slug, short_desc, content, icon, image, benefits, display_order, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      name,
      slug,
      short_desc || null,
      content || null,
      icon || 'Wrench',
      image || null,
      benefitsStr,
      parseInt(display_order || 0, 10),
      is_featured ? 1 : 0
    ]);

    return res.status(201).json({
      success: true,
      message: 'Thêm dịch vụ thành công.',
      data: { id: result.insertId, name, slug }
    });
  } catch (error) {
    console.error('createService error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi tạo dịch vụ.' });
  }
}

// Cập nhật dịch vụ (Admin)
async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { name, short_desc, content, icon, image, benefits, display_order, is_featured } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên dịch vụ không được để trống.' });
    }

    const slug = createSlug(name);
    const benefitsStr = Array.isArray(benefits) ? JSON.stringify(benefits) : (benefits || '[]');

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const index = store.services.findIndex(s => Number(s.id) === Number(id));
      if (index === -1) return res.status(404).json({ success: false, message: 'Dịch vụ không tồn tại.' });

      store.services[index] = {
        ...store.services[index],
        name,
        slug,
        short_desc: short_desc !== undefined ? short_desc : store.services[index].short_desc,
        content: content !== undefined ? content : store.services[index].content,
        icon: icon !== undefined ? icon : store.services[index].icon,
        image: image !== undefined ? image : store.services[index].image,
        benefits: benefitsStr,
        display_order: display_order !== undefined ? parseInt(display_order, 10) : store.services[index].display_order,
        is_featured: is_featured !== undefined ? (is_featured ? 1 : 0) : store.services[index].is_featured,
        updated_at: new Date().toISOString()
      };
      saveFallbackData();
      return res.json({ success: true, message: 'Cập nhật dịch vụ thành công.', data: store.services[index] });
    }

    const sql = `
      UPDATE services SET
        name = ?, slug = ?, short_desc = ?, content = ?, icon = ?, image = ?,
        benefits = ?, display_order = ?, is_featured = ?
      WHERE id = ?
    `;
    await query(sql, [
      name,
      slug,
      short_desc || null,
      content || null,
      icon || 'Wrench',
      image || null,
      benefitsStr,
      parseInt(display_order || 0, 10),
      is_featured ? 1 : 0,
      id
    ]);

    return res.json({ success: true, message: 'Cập nhật dịch vụ thành công.' });
  } catch (error) {
    console.error('updateService error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật dịch vụ.' });
  }
}

// Xóa dịch vụ (Admin)
async function deleteService(req, res) {
  try {
    const { id } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      store.services = store.services.filter(s => Number(s.id) !== Number(id));
      saveFallbackData();
      return res.json({ success: true, message: 'Đã xóa dịch vụ thành công.' });
    }

    await query('DELETE FROM services WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Đã xóa dịch vụ thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa dịch vụ.' });
  }
}

module.exports = {
  getServices,
  getFeaturedServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
};
