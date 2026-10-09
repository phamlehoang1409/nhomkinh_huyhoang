import React, { useState, useEffect } from 'react';
import { fetchArticles, fetchArticleCategories, createArticle, updateArticle, deleteArticle, uploadSingleImage } from '../../services/api';
import Pagination from '../../components/common/Pagination';
import { Plus, Edit2, Trash2, Search, X, Upload, Eye } from 'lucide-react';

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    author: 'Nhôm Kính Huy Hoàng',
    is_published: true
  });
  const [uploading, setUploading] = useState(false);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const [artRes, catRes] = await Promise.all([
        fetchArticles({ page, limit: 10, search: search || undefined, all: 'true' }),
        fetchArticleCategories()
      ]);
      if (artRes.data?.success) {
        setArticles(artRes.data.data);
        setPagination(artRes.data.pagination);
      }
      if (catRes.data?.success) {
        setCategories(catRes.data.data);
      }
    } catch (err) {
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category_id: categories[0]?.id || '',
      excerpt: '',
      content: '',
      thumbnail: '',
      author: 'Nhôm Kính Huy Hoàng',
      is_published: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (a) => {
    setEditingId(a.id);
    setFormData({
      title: a.title || '',
      category_id: a.category_id || '',
      excerpt: a.excerpt || '',
      content: a.content || '',
      thumbnail: a.thumbnail || '',
      author: a.author || 'Nhôm Kính Huy Hoàng',
      is_published: a.is_published !== 0
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const d = new FormData();
        d.append('image', e.target.files[0]);
        const res = await uploadSingleImage(d);
        if (res.data?.success) {
          setFormData(prev => ({ ...prev, thumbnail: res.data.data.url }));
        }
      } catch (err) {
        alert('Lỗi tải ảnh.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateArticle(editingId, formData);
      } else {
        await createArticle(formData);
      }
      setIsModalOpen(false);
      loadData(pagination.page);
    } catch (err) {
      alert('Lỗi lưu bài viết: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await deleteArticle(id);
        loadData(pagination.page);
      } catch (err) {
        alert('Lỗi xóa bài viết.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Quản Lý Tin Tức & Kinh Nghiệm</h1>
          <p className="text-xs text-slate-400 mt-1">Đăng bài viết chia sẻ cẩm nang chọn cửa và kiến thức kỹ thuật</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Bài Viết Mới</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Ảnh</th>
                <th className="p-4">Tiêu đề bài viết</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Tác giả</th>
                <th className="p-4 text-center">Lượt xem</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">Đang tải bài viết...</td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">Chưa có bài viết nào.</td>
                </tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={a.thumbnail || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'} alt={a.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white max-w-[280px] line-clamp-2">{a.title}</td>
                    <td className="p-4 text-amber-400">{a.category_name || 'Kinh nghiệm'}</td>
                    <td className="p-4 text-slate-400">{a.author || 'Huy Hoàng'}</td>
                    <td className="p-4 text-center text-slate-400">{a.views || 0}</td>
                    <td className="p-4 text-center">
                      {a.is_published ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md">Đã đăng</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-500 text-xs font-bold rounded-md">Bản nháp</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(a)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 rounded-lg transition-colors"
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

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => loadData(p)}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Cách phân biệt nhôm Xingfa chính hãng tem đỏ"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Danh mục bài viết</label>
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
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tác giả</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Ảnh đại diện bài viết</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Link ảnh hoặc tải lên..."
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold rounded-xl text-xs cursor-pointer shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tóm tắt ngắn gọn</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Đoạn mở đầu giới thiệu bài viết..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nội dung chi tiết bài viết</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nội dung bài viết, các bước hướng dẫn, kinh nghiệm..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none text-xs"
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-800 border-slate-700"
                  />
                  <span>Xuất bản công khai lên website</span>
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
                  {uploading ? 'Đang tải...' : 'Lưu Bài Viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
