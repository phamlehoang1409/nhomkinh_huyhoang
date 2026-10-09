import React, { useState, useEffect } from 'react';
import { fetchQuoteRequests, updateQuoteStatus, deleteQuoteRequest } from '../../services/api';
import Pagination from '../../components/common/Pagination';
import { Search, Filter, Trash2, Eye, X, Phone, MapPin, Calendar, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [editAdminNote, setEditAdminNote] = useState('');

  const loadQuotes = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchQuoteRequests({
        page,
        limit: 10,
        status: statusFilter || undefined,
        search: search || undefined
      });
      if (res.data?.success) {
        setQuotes(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error loading quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadQuotes(1);
  };

  const handleStatusUpdate = async (id, status, adminNote = null) => {
    try {
      await updateQuoteStatus(id, {
        status,
        admin_note: adminNote !== null ? adminNote : undefined
      });
      loadQuotes(pagination.page);
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote(prev => ({ ...prev, status, ...(adminNote !== null ? { admin_note: adminNote } : {}) }));
      }
    } catch (err) {
      alert('Lỗi cập nhật trạng thái.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa yêu cầu báo giá này? Thao tác không thể khôi phục.')) {
      try {
        await deleteQuoteRequest(id);
        if (selectedQuote?.id === id) setSelectedQuote(null);
        loadQuotes(pagination.page);
      } catch (err) {
        alert('Lỗi xóa yêu cầu.');
      }
    }
  };

  const openDetailModal = (q) => {
    setSelectedQuote(q);
    setEditAdminNote(q.admin_note || '');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">Mới</span>;
      case 'contacted':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Đang liên hệ</span>;
      case 'quoted':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">Đã báo giá</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Hoàn thành</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">Đã hủy</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Quản Lý Yêu Cầu Báo Giá</h1>
          <p className="text-xs text-slate-400 mt-1">Danh sách thông tin khách hàng để lại qua biểu mẫu website</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['', 'new', 'contacted', 'quoted', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st === '' ? 'Tất cả' : st === 'new' ? 'Mới' : st === 'contacted' ? 'Đang liên hệ' : st === 'quoted' ? 'Đã báo giá' : st === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Quotes Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Số điện thoại</th>
                <th className="p-4">Hạng mục & Kích thước</th>
                <th className="p-4">Địa chỉ</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">Đang tải dữ liệu...</td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    Không tìm thấy yêu cầu báo giá nào.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      <div>{q.customer_name}</div>
                      {Array.isArray(q.images) && q.images.length > 0 && (
                        <span className="text-[10px] text-amber-400 block mt-0.5">({q.images.length} ảnh đính kèm)</span>
                      )}
                    </td>
                    <td className="p-4">
                      <a href={`tel:${q.phone}`} className="text-amber-400 font-bold hover:underline">
                        {q.phone}
                      </a>
                    </td>
                    <td className="p-4 max-w-[220px]">
                      <div className="font-semibold text-slate-200 truncate">{q.service_name || 'Tư vấn chung'}</div>
                      {q.dimensions && <div className="text-[11px] text-slate-400 truncate">{q.dimensions}</div>}
                    </td>
                    <td className="p-4 max-w-[150px] truncate text-slate-400">{q.address || 'N/A'}</td>
                    <td className="p-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(q.created_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 whitespace-nowrap">{getStatusBadge(q.status)}</td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openDetailModal(q)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 rounded-lg transition-colors"
                        title="Xóa yêu cầu"
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
        onPageChange={(p) => loadQuotes(p)}
      />

      {/* Detail & Action Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Chi Tiết Yêu Cầu Báo Giá #{selectedQuote.id}
                </h3>
                <span className="text-xs text-slate-400">
                  Gửi lúc: {new Date(selectedQuote.created_at).toLocaleString('vi-VN')}
                </span>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300">
              {/* Customer Info Card */}
              <div className="bg-slate-800/60 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Họ và tên:</span>
                  <strong className="text-white text-sm">{selectedQuote.customer_name}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Số điện thoại:</span>
                  <a href={`tel:${selectedQuote.phone}`} className="text-amber-400 font-bold text-base hover:underline">
                    {selectedQuote.phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Địa chỉ công trình:</span>
                  <span className="text-white">{selectedQuote.address || 'Không có'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hạng mục quan tâm:</span>
                  <span className="text-amber-300 font-semibold">{selectedQuote.service_name || 'N/A'}</span>
                </div>
                {selectedQuote.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kích thước / Số lượng:</span>
                    <span className="text-white">{selectedQuote.dimensions}</span>
                  </div>
                )}
              </div>

              {/* Note */}
              {selectedQuote.note && (
                <div className="space-y-1 bg-slate-800/40 p-4 rounded-2xl">
                  <strong className="text-slate-400 block">Nội dung ghi chú của khách:</strong>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-line">{selectedQuote.note}</p>
                </div>
              )}

              {/* Images */}
              {Array.isArray(selectedQuote.images) && selectedQuote.images.length > 0 && (
                <div className="space-y-2">
                  <strong className="text-slate-400 block">Ảnh / Bản vẽ đính kèm:</strong>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedQuote.images.map((img, idx) => (
                      <a key={idx} href={img} target="_blank" rel="noreferrer" className="block aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-700 hover:scale-105 transition-transform">
                        <img src={img} alt={`Attach ${idx}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Selector & Admin Note */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-white whitespace-nowrap">Trạng thái xử lý:</label>
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => handleStatusUpdate(selectedQuote.id, e.target.value, editAdminNote)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="new">Mới</option>
                    <option value="contacted">Đang liên hệ</option>
                    <option value="quoted">Đã báo giá</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-white block mb-1">Ghi chú nội bộ Admin:</label>
                  <textarea
                    rows={2}
                    placeholder="Ghi chú về tiến độ khảo sát, giá đã báo, hẹn ngày thi công..."
                    value={editAdminNote}
                    onChange={(e) => setEditAdminNote(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none resize-none"
                  ></textarea>
                  <button
                    onClick={() => handleStatusUpdate(selectedQuote.id, selectedQuote.status, editAdminNote)}
                    className="mt-2 px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Lưu ghi chú nội bộ
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => handleDelete(selectedQuote.id)}
                className="px-4 py-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Xóa yêu cầu
              </button>
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-5 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
