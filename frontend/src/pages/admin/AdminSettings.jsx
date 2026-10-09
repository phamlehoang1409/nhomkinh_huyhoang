import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from '../../services/api';
import { Save, CheckCircle2, Phone, MapPin, Mail, Clock, Globe, Shield } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function AdminSettings() {
  const { reloadData } = useSite();
  const [settings, setSettings] = useState({
    site_name: '',
    brand_name: '',
    hotline: '',
    zalo: '',
    email: '',
    address: '',
    opening_hours: '',
    meta_description: '',
    meta_keywords: '',
    google_map_embed: '',
    policy_privacy: '',
    policy_terms: '',
    policy_quote_process: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchSettings();
        if (res.data?.success) {
          setSettings(prev => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateSettings(settings);
      setSaveSuccess(true);
      reloadData();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      alert('Lỗi cập nhật cấu hình.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Đang tải cấu hình website...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Cấu Hình Website & Liên Hệ</h1>
          <p className="text-xs text-slate-400 mt-1">Cập nhật hotline, địa chỉ, bản đồ, SEO và nội dung chính sách</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Đã lưu toàn bộ cấu hình website thành công!</span>
        </div>
      )}

      {/* 1. Contact & Brand Info */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-5">
        <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>Thông Tin Doanh Nghiệp & Liên Hệ</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Tên thương hiệu</label>
            <input
              type="text"
              name="brand_name"
              value={settings.brand_name || ''}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Tiêu đề website</label>
            <input
              type="text"
              name="site_name"
              value={settings.site_name || ''}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Số điện thoại Hotline</label>
            <input
              type="text"
              name="hotline"
              value={settings.hotline || ''}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Số Zalo tư vấn</label>
            <input
              type="text"
              name="zalo"
              value={settings.zalo || ''}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email liên hệ</label>
            <input
              type="email"
              name="email"
              value={settings.email || ''}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Địa chỉ xưởng</label>
            <input
              type="text"
              name="address"
              value={settings.address || ''}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Giờ mở cửa làm việc</label>
            <input
              type="text"
              name="opening_hours"
              value={settings.opening_hours || ''}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Iframe Link Google Map</label>
          <textarea
            rows={2}
            name="google_map_embed"
            value={settings.google_map_embed || ''}
            onChange={handleChange}
            placeholder="https://www.google.com/maps/embed?..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-mono"
          ></textarea>
        </div>
      </div>

      {/* 2. SEO Meta Settings */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
        <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>Tối Ưu SEO & Thẻ Meta Tìm Kiếm</span>
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Meta Description (Mô tả tìm kiếm Google)</label>
          <textarea
            rows={2}
            name="meta_description"
            value={settings.meta_description || ''}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Meta Keywords (Từ khóa cách nhau bằng dấu phẩy)</label>
          <input
            type="text"
            name="meta_keywords"
            value={settings.meta_keywords || ''}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* 3. Policies & Agreements */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-5">
        <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Chính Sách & Quy Trình Dịch Vụ</span>
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Nội dung Chính sách bảo mật</label>
          <textarea
            rows={3}
            name="policy_privacy"
            value={settings.policy_privacy || ''}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Nội dung Điều khoản dịch vụ</label>
          <textarea
            rows={3}
            name="policy_terms"
            value={settings.policy_terms || ''}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Nội dung Quy trình tiếp nhận & báo giá</label>
          <textarea
            rows={4}
            name="policy_quote_process"
            value={settings.policy_quote_process || ''}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-xl shadow-amber-500/20 transition-all"
        >
          {saving ? 'Đang lưu cài đặt...' : 'Lưu Toàn Bộ Cấu Hình'}
        </button>
      </div>
    </form>
  );
}
