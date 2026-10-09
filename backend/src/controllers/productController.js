const { query, isUsingFallback, getFallbackStore, saveFallbackData } = require('../config/db');
const { createSlug } = require('../utils/slug');

// Lấy danh sách sản phẩm có phân trang, tìm kiếm, lọc danh mục và sắp xếp
async function getProducts(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '12', 10)));
    const search = (req.query.search || req.query.q || '').trim().toLowerCase();
    const categoryId = req.query.category_id ? parseInt(req.query.category_id, 10) : null;
    const categorySlug = req.query.category_slug || null;
    const sort = req.query.sort || 'newest'; // newest, oldest, name_asc, name_desc

    if (isUsingFallback()) {
      const store = getFallbackStore();
      let list = [...store.products];

      // Filter active (unless admin flag)
      if (req.query.all !== 'true') {
        list = list.filter(p => p.is_active === 1 || p.is_active === true);
      }

      // Filter by category_id or slug
      if (categoryId) {
        list = list.filter(p => Number(p.category_id) === categoryId);
      } else if (categorySlug) {
        const cat = store.categories.find(c => c.slug === categorySlug);
        if (cat) {
          list = list.filter(p => Number(p.category_id) === Number(cat.id));
        }
      }

      // Search keyword
      if (search) {
        list = list.filter(p => 
          (p.name && p.name.toLowerCase().includes(search)) ||
          (p.code && p.code.toLowerCase().includes(search)) ||
          (p.description && p.description.toLowerCase().includes(search))
        );
      }

      // Sort
      if (sort === 'name_asc') {
        list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      } else if (sort === 'name_desc') {
        list.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
      } else if (sort === 'oldest') {
        list.sort((a, b) => (a.id || 0) - (b.id || 0));
      } else {
        // newest
        list.sort((a, b) => (b.id || 0) - (a.id || 0));
      }

      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const offset = (page - 1) * limit;
      const paginated = list.slice(offset, offset + limit).map(p => {
        const cat = store.categories.find(c => Number(c.id) === Number(p.category_id));
        return {
          ...p,
          category_name: cat ? cat.name : null,
          category_slug: cat ? cat.slug : null,
          specs: typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : p.specs,
          gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
        };
      });

      return res.json({
        success: true,
        data: paginated,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      });
    }

    // MySQL Implementation
    let whereClauses = [];
    let params = [];

    if (req.query.all !== 'true') {
      whereClauses.push('p.is_active = 1');
    }

    if (categoryId) {
      whereClauses.push('p.category_id = ?');
      params.push(categoryId);
    } else if (categorySlug) {
      whereClauses.push('c.slug = ?');
      params.push(categorySlug);
    }

    if (search) {
      whereClauses.push('(LOWER(p.name) LIKE ? OR LOWER(p.code) LIKE ? OR LOWER(p.description) LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    let orderSql = 'ORDER BY p.id DESC';
    if (sort === 'name_asc') orderSql = 'ORDER BY p.name ASC';
    else if (sort === 'name_desc') orderSql = 'ORDER BY p.name DESC';
    else if (sort === 'oldest') orderSql = 'ORDER BY p.id ASC';

    // Count query
    const countSql = `
      SELECT COUNT(*) as total 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereSql}
    `;
    const countResult = await query(countSql, params);
    const total = countResult[0] ? countResult[0].total : 0;
    const totalPages = Math.ceil(total / limit) || 1;

    // Data query
    const offset = (page - 1) * limit;
    const dataSql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereSql}
      ${orderSql}
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, limit, offset];
    const rows = await query(dataSql, dataParams);

    const formatted = rows.map(p => ({
      ...p,
      specs: typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : p.specs,
      gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
    }));

    return res.json({
      success: true,
      data: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách sản phẩm.' });
  }
}

// Lấy sản phẩm nổi bật cho Trang chủ
async function getFeaturedProducts(req, res) {
  try {
    const limit = parseInt(req.query.limit || '8', 10);

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const featured = store.products
        .filter(p => (p.is_featured === 1 || p.is_featured === true) && (p.is_active === 1 || p.is_active === true))
        .slice(0, limit)
        .map(p => {
          const cat = store.categories.find(c => Number(c.id) === Number(p.category_id));
          return {
            ...p,
            category_name: cat ? cat.name : null,
            category_slug: cat ? cat.slug : null,
            specs: typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : p.specs,
            gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
          };
        });
      return res.json({ success: true, data: featured });
    }

    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = 1 AND p.is_active = 1
      ORDER BY p.id DESC
      LIMIT ?
    `;
    const rows = await query(sql, [limit]);
    const formatted = rows.map(p => ({
      ...p,
      specs: typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : p.specs,
      gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
    }));
    return res.json({ success: true, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải sản phẩm nổi bật.' });
  }
}

// Lấy chi tiết sản phẩm theo Slug
async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const p = store.products.find(item => item.slug === slug);
      if (!p) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
      const cat = store.categories.find(c => Number(c.id) === Number(p.category_id));
      return res.json({
        success: true,
        data: {
          ...p,
          category_name: cat ? cat.name : null,
          category_slug: cat ? cat.slug : null,
          specs: typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : p.specs,
          gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
        }
      });
    }

    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
      LIMIT 1
    `;
    const rows = await query(sql, [slug]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    const p = rows[0];
    return res.json({
      success: true,
      data: {
        ...p,
        specs: typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : p.specs,
        gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải chi tiết sản phẩm.' });
  }
}

// Lấy sản phẩm tương tự (cùng danh mục)
async function getSimilarProducts(req, res) {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit || '4', 10);

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const current = store.products.find(p => Number(p.id) === Number(id));
      if (!current) return res.json({ success: true, data: [] });

      const similar = store.products
        .filter(p => Number(p.id) !== Number(id) && Number(p.category_id) === Number(current.category_id) && p.is_active === 1)
        .slice(0, limit)
        .map(p => ({
          ...p,
          specs: typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : p.specs,
          gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
        }));
      return res.json({ success: true, data: similar });
    }

    // Get current product's category_id
    const cur = await query('SELECT category_id FROM products WHERE id = ?', [id]);
    if (!cur || cur.length === 0 || !cur[0].category_id) {
      return res.json({ success: true, data: [] });
    }

    const categoryId = cur[0].category_id;
    const sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
      ORDER BY p.id DESC
      LIMIT ?
    `;
    const rows = await query(sql, [categoryId, id, limit]);
    const formatted = rows.map(p => ({
      ...p,
      specs: typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : p.specs,
      gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : p.gallery_images
    }));
    return res.json({ success: true, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải sản phẩm tương tự.' });
  }
}

// Thêm mới sản phẩm (Admin)
async function createProduct(req, res) {
  try {
    const { name, code, category_id, description, details, specs, price_text, is_featured, is_active, main_image, gallery_images } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên sản phẩm không được để trống.' });
    }

    let slug = createSlug(name);
    const specsStr = typeof specs === 'object' ? JSON.stringify(specs) : (specs || '{}');
    const galleryStr = Array.isArray(gallery_images) ? JSON.stringify(gallery_images) : (gallery_images || '[]');

    if (isUsingFallback()) {
      const store = getFallbackStore();
      let count = 1;
      let finalSlug = slug;
      while (store.products.some(p => p.slug === finalSlug)) {
        finalSlug = `${slug}-${count++}`;
      }
      const newId = store.products.length > 0 ? Math.max(...store.products.map(p => p.id)) + 1 : 1;
      const newProduct = {
        id: newId,
        name,
        slug: finalSlug,
        code: code || `SP-${newId}`,
        category_id: category_id ? parseInt(category_id, 10) : null,
        description: description || null,
        details: details || null,
        specs: specsStr,
        price_text: price_text || 'Liên hệ báo giá',
        is_featured: is_featured ? 1 : 0,
        is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1,
        main_image: main_image || null,
        gallery_images: galleryStr,
        created_at: new Date().toISOString()
      };
      store.products.unshift(newProduct);
      saveFallbackData();
      return res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công.', data: newProduct });
    }

    const sql = `
      INSERT INTO products (name, slug, code, category_id, description, details, specs, price_text, is_featured, is_active, main_image, gallery_images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      name,
      slug,
      code || null,
      category_id || null,
      description || null,
      details || null,
      specsStr,
      price_text || 'Liên hệ báo giá',
      is_featured ? 1 : 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      main_image || null,
      galleryStr
    ]);

    return res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công.',
      data: { id: result.insertId, name, slug }
    });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi thêm sản phẩm.' });
  }
}

// Cập nhật sản phẩm (Admin)
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, code, category_id, description, details, specs, price_text, is_featured, is_active, main_image, gallery_images } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên sản phẩm không được để trống.' });
    }

    const slug = createSlug(name);
    const specsStr = typeof specs === 'object' ? JSON.stringify(specs) : (specs || '{}');
    const galleryStr = Array.isArray(gallery_images) ? JSON.stringify(gallery_images) : (gallery_images || '[]');

    if (isUsingFallback()) {
      const store = getFallbackStore();
      const index = store.products.findIndex(p => Number(p.id) === Number(id));
      if (index === -1) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại.' });

      store.products[index] = {
        ...store.products[index],
        name,
        slug,
        code: code !== undefined ? code : store.products[index].code,
        category_id: category_id !== undefined ? parseInt(category_id, 10) : store.products[index].category_id,
        description: description !== undefined ? description : store.products[index].description,
        details: details !== undefined ? details : store.products[index].details,
        specs: specsStr,
        price_text: price_text || store.products[index].price_text,
        is_featured: is_featured !== undefined ? (is_featured ? 1 : 0) : store.products[index].is_featured,
        is_active: is_active !== undefined ? (is_active ? 1 : 0) : store.products[index].is_active,
        main_image: main_image !== undefined ? main_image : store.products[index].main_image,
        gallery_images: galleryStr,
        updated_at: new Date().toISOString()
      };
      saveFallbackData();
      return res.json({ success: true, message: 'Cập nhật sản phẩm thành công.', data: store.products[index] });
    }

    const sql = `
      UPDATE products SET
        name = ?, slug = ?, code = ?, category_id = ?, description = ?, details = ?,
        specs = ?, price_text = ?, is_featured = ?, is_active = ?, main_image = ?, gallery_images = ?
      WHERE id = ?
    `;
    await query(sql, [
      name,
      slug,
      code || null,
      category_id || null,
      description || null,
      details || null,
      specsStr,
      price_text || 'Liên hệ báo giá',
      is_featured ? 1 : 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      main_image || null,
      galleryStr,
      id
    ]);

    return res.json({ success: true, message: 'Cập nhật sản phẩm thành công.' });
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật sản phẩm.' });
  }
}

// Xóa sản phẩm (Admin)
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      store.products = store.products.filter(p => Number(p.id) !== Number(id));
      saveFallbackData();
      return res.json({ success: true, message: 'Đã xóa sản phẩm thành công.' });
    }

    await query('DELETE FROM products WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Đã xóa sản phẩm thành công.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm.' });
  }
}

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
