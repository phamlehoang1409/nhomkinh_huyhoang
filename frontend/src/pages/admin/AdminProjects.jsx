import React, { useState, useEffect } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject, uploadSingleImage, uploadMultipleImages } from '../../services/api';
import Pagination from '../../components/common/Pagination';
import { Plus, Edit2, Trash2, Search, X, Upload, Star } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cửa nhôm kính',
    client_name: '',
    location: 'Thanh Hóa',
    completion_date: '',
    description: '',
    main_image: '',
    gallery_images: [],
    is_featured: true
  });
  const [uploading, setUploading] = useState(false);

  const loadProjects = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchProjects({ page, limit: 10, search: search || undefined });
      if (res.data?.success) {
        setProjects(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(1);
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Cửa nhôm kính',
      client_name: 'Gia đình anh Tuấn',
      location: 'Thọ Xuân, Thanh Hóa',
      completion_date: 'Tháng 03/2026',
      description: '',
      main_image: '',
      gallery_images: [],
      is_featured: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setFormData({
      title: p.title || '',
      category: p.category || 'Cửa nhôm kính',
      client_name: p.client_name || '',
      location: p.location || '',
      completion_date: p.completion_date || '',
      description: p.description || '',
      main_image: p.main_image || '',
      gallery_images: Array.isArray(p.gallery_images) ? p.gallery_images : [],
      is_featured: !!p.is_featured
    });
    setIsModalOpen(true);
  };

  const handleMainImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const d = new FormData();
        d.append('image', e.target.files[0]);
        const res = await uploadSingleImage(d);
        if (res.data?.success) {
          setFormData(prev => ({ ...prev, main_image: res.data.data.url }));
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
        await updateProject(editingId, formData);
      } else {
        await createProject(formData);
      }
      setIsModalOpen(false);
      loadProjects(pagination.page);
    } catch (err) {
      alert('Lỗi lưu công trình: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công trình này?')) {
      try {
        await deleteProject(id);
        loadProjects(pagination.page);
      } catch (err) {
        alert('Lỗi xóa công trình.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Quản Lý Công Trình</h1>
          <p className="text-xs text-slate-400 mt-1">Lưu trữ và cập nhật hình ảnh các công trình đã hoàn thiện</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Công Trình Mới</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Ảnh</th>
                <th className="p-4">Tên công trình</th>
                <th className="p-4">Hạng mục</th>
                <th className="p-4">Địa điểm</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4 text-center">Nổi bật</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">Đang tải công trình...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">Chưa có công trình nào.</td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={p.main_image || 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=400&q=80'} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white max-w-[240px] truncate">{p.title}</td>
                    <td className="p-4 text-amber-400">{p.category}</td>
                    <td className="p-4 text-slate-400">{p.location}</td>
                    <td className="p-4 text-slate-400">{p.client_name || 'N/A'}</td>
                    <td className="p-4 text-center">
                      {p.is_featured ? (
                        <span className="inline-block p-1 bg-amber-500/20 text-amber-400 rounded-lg"><Star className="w-3.5 h-3.5 fill-amber-400" /></span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
        onPageChange={(p) => loadProjects(p)}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Chỉnh Sửa Công Trình' : 'Thêm Công Trình Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tên công trình *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Lắp đặt cửa nhôm Xingfa nhà phố 3 tầng"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phân loại hạng mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Cửa nhôm kính">Cửa nhôm kính</option>
                    <option value="Vách kính cường lực">Vách kính cường lực</option>
                    <option value="Lan can & Mái kính">Lan can & Mái kính</option>
                    <option value="Công trình tổng hợp">Công trình tổng hợp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Địa điểm</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ví dụ: Thọ Xuân, Thanh Hóa"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Khách hàng / Công trình</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Ví dụ: Gia đình anh Minh"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Thời gian hoàn thành</label>
                  <input
                    type="text"
                    value={formData.completion_date}
                    onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                    placeholder="Ví dụ: Tháng 03/2026"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Ảnh chính công trình</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Link ảnh..."
                    value={formData.main_image}
                    onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold rounded-xl text-xs cursor-pointer shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mô tả công trình</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Khối lượng thi công, số lượng bộ cửa, màu sắc nhôm..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none text-xs"
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-800 border-slate-700"
                  />
                  <span>Hiển thị nổi bật trang chủ</span>
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
                  {uploading ? 'Đang tải...' : 'Lưu Công Trình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
