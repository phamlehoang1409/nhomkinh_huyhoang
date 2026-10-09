import React, { useState, useEffect } from 'react';
import {
  fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct,
  uploadSingleImage, uploadMultipleImages
} from '../../services/api';
import Pagination from '../../components/common/Pagination';
import { Plus, Edit2, Trash2, Search, Eye, X, Image as ImageIcon, Check, Star, Layers, Upload } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category_id: '',
    description: '',
    details: '',
    price_text: 'Liên hệ báo giá',
    is_featured: false,
    is_active: true,
    main_image: '',
    gallery_images: []
  });
  const [specList, setSpecList] = useState([{ key: '', val: '' }]);
  const [uploading, setUploading] = useState(false);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetchProducts({
          page,
          limit: 10,
          category_id: categoryFilter || undefined,
          search: search || undefined,
          all: 'true'
        }),
        fetchCategories()
      ]);

      if (prodRes.data?.success) {
        setProducts(prodRes.data.data);
        setPagination(prodRes.data.pagination);
      }
      if (catRes.data?.success) {
        setCategories(catRes.data.data);
      }
    } catch (err) {
      console.error('Error loading admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData(1);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      code: '',
      category_id: categories[0]?.id || '',
      description: '',
      details: '',
      price_text: 'Liên hệ báo giá',
      is_featured: false,
      is_active: true,
      main_image: '',
      gallery_images: []
    });
    setSpecList([
      { key: 'Hệ nhôm', val: 'Xingfa nhập khẩu chính hãng' },
      { key: 'Độ dày', val: '2.0mm' },
      { key: 'Kính', val: 'Kính an toàn / Kính cường lực' },
      { key: 'Phụ kiện', val: 'Kinlong đồng bộ' },
      { key: 'Bảo hành', val: '5 năm' }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name || '',
      code: p.code || '',
      category_id: p.category_id || '',
      description: p.description || '',
      details: p.details || '',
      price_text: p.price_text || 'Liên hệ báo giá',
      is_featured: !!p.is_featured,
      is_active: p.is_active !== 0,
      main_image: p.main_image || '',
      gallery_images: Array.isArray(p.gallery_images) ? p.gallery_images : []
    });

    const specsObj = typeof p.specs === 'object' && p.specs !== null ? p.specs : {};
    const specsArr = Object.entries(specsObj).map(([k, v]) => ({ key: k, val: v }));
    setSpecList(specsArr.length > 0 ? specsArr : [{ key: '', val: '' }]);
    setIsModalOpen(true);
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specList];
    updated[index][field] = value;
    setSpecList(updated);
  };

  const addSpecRow = () => {
    setSpecList([...specList, { key: '', val: '' }]);
  };

  const removeSpecRow = (index) => {
    setSpecList(specList.filter((_, i) => i !== index));
  };

  const handleMainImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const data = new FormData();
        data.append('image', e.target.files[0]);
        const res = await uploadSingleImage(data);
        if (res.data?.success) {
          setFormData(prev => ({ ...prev, main_image: res.data.data.url }));
        }
      } catch (err) {
        alert('Không thể tải ảnh lên.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleGalleryUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      try {
        const data = new FormData();
        Array.from(e.target.files).forEach(f => data.append('images', f));
        const res = await uploadMultipleImages(data);
        if (res.data?.success) {
          setFormData(prev => ({
            ...prev,
            gallery_images: [...prev.gallery_images, ...res.data.data]
          }));
        }
      } catch (err) {
        alert('Không thể tải ảnh lên.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Convert spec list to object
    const specsObj = {};
    specList.forEach(s => {
      if (s.key.trim()) specsObj[s.key.trim()] = s.val.trim();
    });

    const payload = {
      ...formData,
      specs: specsObj
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setIsModalOpen(false);
      loadData(pagination.page);
    } catch (err) {
      alert('Lỗi lưu sản phẩm: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(id);
        loadData(pagination.page);
      } catch (err) {
        alert('Lỗi xóa sản phẩm.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Quản Lý Sản Phẩm</h1>
          <p className="text-xs text-slate-400 mt-1">Thêm, sửa, cập nhật hình ảnh và thông số kỹ thuật sản phẩm</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 w-full md:w-56"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Ảnh</th>
                <th className="p-4">Tên sản phẩm & Mã</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Giá hiển thị</th>
                <th className="p-4 text-center">Nổi bật</th>
                <th className="p-4 text-center">Hiển thị</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">Đang tải sản phẩm...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={p.main_image || 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=400&q=80'} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white max-w-[260px]">
                      <div className="line-clamp-2">{p.name}</div>
                      {p.code && <span className="text-[11px] text-amber-400 font-semibold">{p.code}</span>}
                    </td>
                    <td className="p-4 text-slate-400">{p.category_name || 'Chưa phân loại'}</td>
                    <td className="p-4 text-amber-400 font-semibold">{p.price_text || 'Liên hệ báo giá'}</td>
                    <td className="p-4 text-center">
                      {p.is_featured ? (
                        <span className="inline-block p-1 bg-amber-500/20 text-amber-400 rounded-lg"><Star className="w-3.5 h-3.5 fill-amber-400" /></span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {p.is_active ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md">Bật</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-500 text-xs font-bold rounded-md">Ẩn</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => loadData(p)}
      />

      {/* Product Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Cửa đi 4 cánh nhôm Xingfa hệ 55"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mã sản phẩm</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ví dụ: XF55-4CQ"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Danh mục sản phẩm</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Giá hiển thị</label>
                  <input
                    type="text"
                    value={formData.price_text}
                    onChange={(e) => setFormData({ ...formData, price_text: e.target.value })}
                    placeholder="Liên hệ báo giá"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Main Image URL / Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Ảnh đại diện chính</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Dán link ảnh hoặc tải lên từ máy tính..."
                    value={formData.main_image}
                    onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                  <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold rounded-xl text-xs cursor-pointer shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                  </label>
                </div>
                {formData.main_image && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                    <img src={formData.main_image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả tóm tắt tính năng nổi bật của cửa..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none text-xs"
                ></textarea>
              </div>

              {/* Specifications Key-Value */}
              <div className="bg-slate-800/50 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>Thông Số Kỹ Thuật (Thông số - Giá trị)</span>
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="text-xs font-bold text-amber-400 hover:underline"
                  >
                    + Thêm dòng
                  </button>
                </div>

                <div className="space-y-2">
                  {specList.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Tên thông số (Hệ nhôm, Độ dày...)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                        className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Giá trị (Xingfa 55, 2.0mm...)"
                        value={spec.val}
                        onChange={(e) => handleSpecChange(idx, 'val', e.target.value)}
                        className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      {specList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Long Details */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nội dung chi tiết & Hướng dẫn sử dụng</label>
                <textarea
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Nội dung chi tiết về ưu điểm, ứng dụng và quy trình bảo hành..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none text-xs"
                ></textarea>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-800 border-slate-700"
                  />
                  <span>Hiển thị nổi bật trang chủ</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-800 border-slate-700"
                  />
                  <span>Đang mở bán / Hiển thị</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs"
                >
                  {uploading ? 'Đang tải ảnh...' : 'Lưu Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
