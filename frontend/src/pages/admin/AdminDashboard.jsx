import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare, ShoppingBag, Wrench, Building2, FileText, Star,
  TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowRight, User
} from 'lucide-react';
import { fetchDashboardStats, updateQuoteStatus } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await fetchDashboardStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateQuoteStatus(id, { status: newStatus });
      loadStats();
    } catch (err) {
      alert('Không thể cập nhật trạng thái.');
    }
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
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Đang tải số liệu thống kê...</div>;
  }

  const quotes = stats?.quotes || {};

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Tổng Quan Quản Trị</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi yêu cầu báo giá của khách hàng và cập nhật dữ liệu website
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            + Thêm sản phẩm
          </Link>
          <Link
            to="/admin/quotes"
            className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold rounded-xl text-xs transition-colors"
          >
            Xem yêu cầu ({quotes.total || 0})
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* New Quotes */}
        <div className="bg-slate-900 border border-rose-500/30 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-rose-400 uppercase">Yêu cầu mới</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{quotes.new || 0}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Cần liên hệ tư vấn sớm</span>
        </div>

        {/* Total Quotes */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-400 uppercase">Tổng yêu cầu</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{quotes.total || 0}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Khách gửi qua website</span>
        </div>

        {/* Total Products */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-400 uppercase">Sản phẩm mẫu</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats?.productsCount || 0}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Đang hiển thị trên web</span>
        </div>

        {/* Total Projects */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-400 uppercase">Công trình</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats?.projectsCount || 0}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Hình ảnh thực tế</span>
        </div>
      </div>

      {/* Recent Quote Inquiries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Yêu Cầu Báo Giá Gần Đây</h2>
            <p className="text-xs text-slate-400">Danh sách khách hàng vừa để lại thông tin trên website</p>
          </div>
          <Link
            to="/admin/quotes"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Số điện thoại</th>
                <th className="p-4">Hạng mục</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Chuyển trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {!stats?.recentQuotes || stats.recentQuotes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    Chưa có yêu cầu báo giá nào từ khách hàng.
                  </td>
                </tr>
              ) : (
                stats.recentQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{q.customer_name}</td>
                    <td className="p-4 text-amber-400 font-semibold">{q.phone}</td>
                    <td className="p-4 max-w-[200px] truncate">{q.service_name || 'N/A'}</td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(q.created_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">{getStatusBadge(q.status)}</td>
                    <td className="p-4 text-right">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-1.5 focus:outline-none focus:border-amber-500"
                      >
                        <option value="new">Mới</option>
                        <option value="contacted">Đang liên hệ</option>
                        <option value="quoted">Đã báo giá</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
