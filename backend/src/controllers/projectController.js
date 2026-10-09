const { query, isUsingFallback, getFallbackStore, saveFallbackData } = require('../config/db');
const { createSlug } = require('../utils/slug');

// Lấy danh sách công trình đã thi công (có phân trang & lọc danh mục)
async function getProjects(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '9', 10)));
    const category = req.query.category || '';
    const search = (req.query.search || '').trim().toLowerCase();

    if (isUsingFallback()) {
      const store = getFallbackStore();
      let list = [...store.projects];

      if (category && category !== 'all' && category !== 'Tất cả') {
        list = list.filter(p => p.category === category);
      }

      if (search) {
        list = list.filter(p => 
          (p.title && p.title.toLowerCase().includes(search)) ||
          (p.location && p.location.toLowerCase().includes(search)) ||
          (p.description && p.description.toLowerCase().includes(search))
        );
      }

      list.sort((a, b) => (b.id || 0) - (a.id || 0));

      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const offset = (page - 1) * limit;
      const paginated = list.slice(offset, offset + limit).map(p => ({
        ...p,
        gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
      }));

      return res.json({
        success: true,
        data: paginated,
        pagination: { page, limit, total, totalPages }
      });
    }

    let whereClauses = [];
    let params = [];

    if (category && category !== 'all' && category !== 'Tất cả') {
      whereClauses.push('category = ?');
      params.push(category);
    }

    if (search) {
      whereClauses.push('(LOWER(title) LIKE ? OR LOWER(location) LIKE ? OR LOWER(description) LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as total FROM projects ${whereSql}`;
    const countResult = await query(countSql, params);
    const total = countResult[0] ? countResult[0].total : 0;
    const totalPages = Math.ceil(total / limit) || 1;

    const offset = (page - 1) * limit;
    const dataSql = `SELECT * FROM projects ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`;
    const rows = await query(dataSql, [...params, limit, offset]);

    const formatted = rows.map(p => ({
      ...p,
      gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
    }));

    return res.json({
      success: true,
      data: formatted,
      pagination: { page, limit, total, totalPages }
    });
  } catch (error) {
    console.error('getProjects error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách công trình.' });
  }
}

// Lấy chi tiết công trình theo Slug
async function getProjectBySlug(req, res) {
  try {
    const { slug } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const project = store.projects.find(p => p.slug === slug);
      if (!project) return res.status(404).json({ success: false, message: 'Không tìm thấy công trình.' });
      return res.json({
        success: true,
        data: {
          ...project,
          gallery_images: typeof project.gallery_images === 'string' ? JSON.parse(project.gallery_images || '[]') : project.gallery_images
        }
      });
    }

    const rows = await query('SELECT * FROM projects WHERE slug = ? LIMIT 1', [slug]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy công trình.' });
    }

    const p = rows[0];
    return res.json({
      success: true,
      data: {
        ...p,
        gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải chi tiết công trình.' });
  }
}

// Thêm công trình (Admin)
async function createProject(req, res) {
  try {
    const { title, category, client_name, location, completion_date, description, main_image, gallery_images, is_featured } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Tiêu đề công trình không được để trống.' });
    }

    const slug = createSlug(title);
    const galleryStr = Array.isArray(gallery_images) ? JSON.stringify(gallery_images) : (gallery_images || '[]');

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const newId = store.projects.length > 0 ? Math.max(...store.projects.map(p => p.id)) + 1 : 1;
      const newProject = {
        id: newId,
        title,
        slug,
        category: category || 'Cửa nhôm kính',
        client_name: client_name || null,
        location: location || 'Thanh Hóa',
        completion_date: completion_date || null,
        description: description || null,
        main_image: main_image || null,
        gallery_images: galleryStr,
        is_featured: is_featured ? 1 : 0,
        created_at: new Date().toISOString()
      };
      store.projects.unshift(newProject);
      saveFallbackData();
      return res.status(201).json({ success: true, message: 'Thêm công trình thành công.', data: newProject });
    }

    const sql = `
      INSERT INTO projects (title, slug, category, client_name, location, completion_date, description, main_image, gallery_images, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      title,
      slug,
      category || 'Cửa nhôm kính',
      client_name || null,
      location || 'Thanh Hóa',
      completion_date || null,
      description || null,
      main_image || null,
      galleryStr,
      is_featured ? 1 : 0
    ]);

    return res.status(201).json({
      success: true,
      message: 'Thêm công trình thành công.',
      data: { id: result.insertId, title, slug }
    });
  } catch (error) {
    console.error('createProject error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi tạo công trình.' });
  }
}

// Cập nhật công trình (Admin)
async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { title, category, client_name, location, completion_date, description, main_image, gallery_images, is_featured } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Tiêu đề không được để trống.' });
    }

    const slug = createSlug(title);
    const galleryStr = Array.isArray(gallery_images) ? JSON.stringify(gallery_images) : (gallery_images || '[]');

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const index = store.projects.findIndex(p => Number(p.id) === Number(id));
      if (index === -1) return res.status(404).json({ success: false, message: 'Công trình không tồn tại.' });

      store.projects[index] = {
        ...store.projects[index],
        title,
        slug,
        category: category || store.projects[index].category,
        client_name: client_name !== undefined ? client_name : store.projects[index].client_name,
        location: location !== undefined ? location : store.projects[index].location,
        completion_date: completion_date !== undefined ? completion_date : store.projects[index].completion_date,
        description: description !== undefined ? description : store.projects[index].description,
        main_image: main_image !== undefined ? main_image : store.projects[index].main_image,
        gallery_images: galleryStr,
        is_featured: is_featured !== undefined ? (is_featured ? 1 : 0) : store.projects[index].is_featured
      };
      saveFallbackData();
      return res.json({ success: true, message: 'Cập nhật công trình thành công.', data: store.projects[index] });
    }

    const sql = `
      UPDATE projects SET
        title = ?, slug = ?, category = ?, client_name = ?, location = ?,
        completion_date = ?, description = ?, main_image = ?, gallery_images = ?, is_featured = ?
      WHERE id = ?
    `;
    await query(sql, [
      title,
      slug,
      category || 'Cửa nhôm kính',
      client_name || null,
      location || 'Thanh Hóa',
      completion_date || null,
      description || null,
      main_image || null,
      galleryStr,
      is_featured ? 1 : 0,
      id
    ]);

    return res.json({ success: true, message: 'Cập nhật công trình thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật công trình.' });
  }
}

// Xóa công trình (Admin)
async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      store.projects = store.projects.filter(p => Number(p.id) !== Number(id));
      saveFallbackData();
      return res.json({ success: true, message: 'Đã xóa công trình.' });
    }

    await query('DELETE FROM projects WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Đã xóa công trình thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa công trình.' });
  }
}

module.exports = {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
};
