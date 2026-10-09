const { query, isUsingFallback, getFallbackStore, saveFallbackData } = require('../config/db');
const { createSlug } = require('../utils/slug');

// Lấy danh sách danh mục (kèm số lượng sản phẩm)
async function getCategories(req, res) {
  try {
    if (isUsingFallback()) {
      const store = getFallbackStore();
      const categories = store.categories.map(c => {
        const productCount = store.products.filter(p => Number(p.category_id) === Number(c.id)).length;
        return { ...c, product_count: productCount };
      });
      categories.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      return res.json({ success: true, data: categories });
    }

    const sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.id ASC
    `;
    const rows = await query(sql);
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách danh mục.' });
  }
}

// Lấy chi tiết danh mục theo Slug
async function getCategoryBySlug(req, res) {
  try {
    const { slug } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const category = store.categories.find(c => c.slug === slug);
      if (!category) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục.' });
      return res.json({ success: true, data: category });
    }

    const rows = await query('SELECT * FROM categories WHERE slug = ? LIMIT 1', [slug]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục.' });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải chi tiết danh mục.' });
  }
}

// Thêm mới danh mục (Admin)
async function createCategory(req, res) {
  try {
    const { name, description, image, display_order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên danh mục không được để trống.' });
    }

    let slug = createSlug(name);

    if (isUsingFallback()) {
      const store = getFallbackStore();
      // Check duplicate slug
      let count = 1;
      let finalSlug = slug;
      while (store.categories.some(c => c.slug === finalSlug)) {
        finalSlug = `${slug}-${count++}`;
      }
      const newId = store.categories.length > 0 ? Math.max(...store.categories.map(c => c.id)) + 1 : 1;
      const newCat = {
        id: newId,
        name,
        slug: finalSlug,
        description: description || null,
        image: image || null,
        display_order: parseInt(display_order || 0, 10),
        created_at: new Date().toISOString()
      };
      store.categories.push(newCat);
      saveFallbackData();
      return res.status(201).json({ success: true, message: 'Thêm danh mục thành công.', data: newCat });
    }

    const result = await query(
      'INSERT INTO categories (name, slug, description, image, display_order) VALUES (?, ?, ?, ?, ?)',
      [name, slug, description || null, image || null, parseInt(display_order || 0, 10)]
    );

    return res.status(201).json({
      success: true,
      message: 'Thêm danh mục thành công.',
      data: { id: result.insertId, name, slug }
    });
  } catch (error) {
    console.error('createCategory error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi tạo danh mục.' });
  }
}

// Cập nhật danh mục (Admin)
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, image, display_order } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên danh mục không được để trống.' });
    }

    const slug = createSlug(name);

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const catIndex = store.categories.findIndex(c => Number(c.id) === Number(id));
      if (catIndex === -1) return res.status(404).json({ success: false, message: 'Danh mục không tồn tại.' });

      store.categories[catIndex] = {
        ...store.categories[catIndex],
        name,
        slug,
        description: description !== undefined ? description : store.categories[catIndex].description,
        image: image !== undefined ? image : store.categories[catIndex].image,
        display_order: display_order !== undefined ? parseInt(display_order, 10) : store.categories[catIndex].display_order
      };
      saveFallbackData();
      return res.json({ success: true, message: 'Cập nhật danh mục thành công.', data: store.categories[catIndex] });
    }

    await query(
      'UPDATE categories SET name = ?, slug = ?, description = ?, image = ?, display_order = ? WHERE id = ?',
      [name, slug, description || null, image || null, parseInt(display_order || 0, 10), id]
    );

    return res.json({ success: true, message: 'Cập nhật danh mục thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật danh mục.' });
  }
}

// Xóa danh mục (Admin)
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      store.categories = store.categories.filter(c => Number(c.id) !== Number(id));
      // update products that had this category
      store.products.forEach(p => {
        if (Number(p.category_id) === Number(id)) p.category_id = null;
      });
      saveFallbackData();
      return res.json({ success: true, message: 'Đã xóa danh mục.' });
    }

    await query('DELETE FROM categories WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Đã xóa danh mục thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa danh mục.' });
  }
}

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
