import React, { useState, useEffect } from 'react';
import { fetchServices, createService, updateService, deleteService, uploadSingleImage } from '../../services/api';
import { Plus, Edit2, Trash2, X, Upload, CheckCircle2, Star } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    short_desc: '',
    content: '',
    icon: 'DoorClosed',
    image: '',
    benefits: [],
    display_order: 0,
    is_featured: true
  });
  const [benefitsText, setBenefitsText] = useState('');

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetchServices();
      if (res.data?.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      short_desc: '',
      content: '',
      icon: 'DoorClosed',
      image: '',
      benefits: [],
      display_order: services.length + 1,
      is_featured: true
    });
    setBenefitsText('Nhôm kính chuẩn chính hãng 100%\nBảo hành dài hạn\nKhảo sát tận nơi miễn phí');
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingId(s.id);
    setFormData({
      name: s.name || '',
      short_desc: s.short_desc || '',
      content: s.content || '',
      icon: s.icon || 'DoorClosed',
      image: s.image || '',
      benefits: Array.isArray(s.benefits) ? s.benefits : [],
      display_order: s.display_order || 0,
      is_featured: !!s.is_featured
    });
    setBenefitsText(Array.isArray(s.benefits) ? s.benefits.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const data = new FormData();
        data.append('image', e.target.files[0]);
        const res = await uploadSingleImage(data);
        if (res.data?.success) {
          setFormData(prev => ({ ...prev, image: res.data.data.url }));
        }
      } catch (err) {
        alert('Lỗi upload ảnh.');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const benefitsArr = benefitsText
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const payload = {
      ...formData,
      benefits: benefitsArr
    };

    try {
      if (editingId) {
        await updateService(editingId, payload);
      } else {
        await createService(payload);
      }
      setIsModalOpen(false);
      loadServices();
    } catch (err) {
      alert('Lỗi lưu dịch vụ: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        await deleteService(id);
        loadServices();
      } catch (err) {
        alert('Lỗi xóa dịch vụ.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Quản Lý Dịch Vụ</h1>
          <p className="text-xs text-slate-400 mt-1">Các hạng mục thi công nhôm kính hiển thị trên website</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Dịch Vụ Mới</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Ảnh</th>
                <th className="p-4">Tên dịch vụ</th>
                <th className="p-4">Mô tả ngắn</th>
                <th className="p-4 text-center">Thứ tự</th>
                <th className="p-4 text-center">Nổi bật</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">Đang tải dịch vụ...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Chưa có dịch vụ nào.</td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={s.image || 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=400&q=80'} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white max-w-[240px]">{s.name}</td>
                    <td className="p-4 text-slate-400 max-w-[280px] truncate">{s.short_desc}</td>
                    <td className="p-4 text-center">{s.display_order}</td>
                    <td className="p-4 text-center">
                      {s.is_featured ? (
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-md">Bật</span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tên dịch vụ thi công *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Thi công cửa nhôm Xingfa nhập khẩu"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value || 0, 10) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Icon đại diện</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="DoorClosed">Cửa mở (DoorClosed)</option>
                    <option value="Maximize">Khung kính (Maximize)</option>
                    <option value="Layers">Vách ngăn (Layers)</option>
                    <option value="ShieldCheck">Lan can & Mái (ShieldCheck)</option>
                    <option value="Wrench">Sửa chữa (Wrench)</option>
                    <option value="ClipboardList">Khảo sát báo giá (ClipboardList)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Ảnh đại diện dịch vụ</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Link ảnh..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  placeholder="Mô tả tóm tắt dịch vụ..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Các cam kết & ưu điểm (mỗi dòng 1 ý)</label>
                <textarea
                  rows={3}
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  placeholder="Nhôm chính hãng 100%&#10;Độ dày đạt chuẩn 2.0mm&#10;Bảo hành 5 năm"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nội dung bài giới thiệu chi tiết</label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Quy trình thi công, chất liệu kính và cam kết..."
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
                  <span>Hiển thị nổi bật trên trang chủ</span>
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
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Lưu Dịch Vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
