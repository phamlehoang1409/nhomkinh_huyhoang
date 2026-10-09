import React, { useState, useEffect } from 'react';
import { fetchReviews, createAdminReview, updateReview, deleteReview } from '../../services/api';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    comment: '',
    address_or_role: 'Thọ Xuân, Thanh Hóa',
    is_published: true
  });

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetchReviews({ all: 'true' });
      if (res.data?.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      customer_name: '',
      rating: 5,
      comment: '',
      address_or_role: 'Khách hàng tại Thanh Hóa',
      is_published: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingId(r.id);
    setFormData({
      customer_name: r.customer_name || '',
      rating: r.rating || 5,
      comment: r.comment || '',
      address_or_role: r.address_or_role || '',
      is_published: r.is_published !== 0
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateReview(editingId, formData);
      } else {
        await createAdminReview(formData);
      }
      setIsModalOpen(false);
      loadReviews();
    } catch (err) {
      alert('Lỗi lưu đánh giá.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      try {
        await deleteReview(id);
        loadReviews();
      } catch (err) {
        alert('Lỗi xóa đánh giá.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Quản Lý Đánh Giá Khách Hàng</h1>
          <p className="text-xs text-slate-400 mt-1">Cập nhật phản hồi thực tế của khách hàng hiển thị trên trang chủ</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Đánh Giá Mới</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Địa chỉ / Vai trò</th>
                <th className="p-4">Số sao</th>
                <th className="p-4">Nội dung đánh giá</th>
                <th className="p-4 text-center">Hiển thị</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">Đang tải đánh giá...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Chưa có đánh giá nào.</td></tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{r.customer_name}</td>
                    <td className="p-4 text-slate-400">{r.address_or_role}</td>
                    <td className="p-4">
                      <div className="flex items-center text-amber-400">
                        {[...Array(r.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-[300px] truncate text-slate-300">"{r.comment}"</td>
                    <td className="p-4 text-center">
                      {r.is_published ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md">Bật</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-500 text-xs font-bold rounded-md">Ẩn</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEditModal(r)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 rounded-lg">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Sửa Đánh Giá' : 'Thêm Đánh Giá'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tên khách hàng *</label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Ví dụ: Bác Tuấn"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Địa chỉ / Công trình</label>
                  <input
                    type="text"
                    value={formData.address_or_role}
                    onChange={(e) => setFormData({ ...formData, address_or_role: e.target.value })}
                    placeholder="Thọ Hải, Thọ Xuân"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Đánh giá (Số sao)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                    <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                    <option value="3">⭐⭐⭐ (3 sao)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nội dung nhận xét *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Cửa nhôm làm rất chắc chắn, thợ cẩn thận..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white resize-none text-xs"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-800"
                />
                <span>Hiển thị công khai</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
