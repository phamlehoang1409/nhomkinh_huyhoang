import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchServiceBySlug } from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import { Phone, CheckCircle2, ArrowRight, ShieldCheck, Wrench, ChevronRight } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { settings, openQuoteModal, services } = useSite();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetchServiceBySlug(slug);
        if (res.data?.success) {
          setService(res.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [slug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 dark:text-slate-400">Đang tải chi tiết dịch vụ...</div>;
  }

  if (error || !service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Không tìm thấy dịch vụ</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Dịch vụ này không tồn tại hoặc đã được cập nhật.</p>
        <Link to="/dich-vu" className="inline-block px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm">
          Quay lại danh sách dịch vụ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Dịch vụ thi công', link: '/dich-vu' },
          { label: service.name }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left main content (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header & Main Image */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {service.name}
            </h1>
            {service.short_desc && (
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-amber-500 pl-4 bg-slate-100 dark:bg-slate-900/50 py-2 rounded-r-xl">
                {service.short_desc}
              </p>
            )}
          </div>

          <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md">
            <img
              src={service.image || 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=1200&q=80'}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Benefits */}
          {Array.isArray(service.benefits) && service.benefits.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl space-y-4 shadow-sm">
              <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>Ưu Điểm & Cam Kết Khi Thi Công</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {service.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Content */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">Mô Tả Chi Tiết Hạng Mục</h3>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
              {service.content || 'Nhôm Kính Huy Hoàng cam kết tư vấn, gia công sản xuất và thi công lắp đặt đạt chuẩn kỹ thuật cao, thẩm mỹ và an toàn bền vững.'}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="p-6 sm:p-8 bg-amber-500/10 dark:bg-gradient-to-r dark:from-amber-500/20 dark:via-slate-900 dark:to-slate-900 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Cần khảo sát báo giá cho hạng mục này?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Đo đạc thực tế tại công trình Thọ Xuân - Thanh Hóa miễn phí.</p>
            </div>
            <button
              onClick={() => openQuoteModal({ service_name: service.name, note: `Yêu cầu báo giá dịch vụ: ${service.name}` })}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm shrink-0 shadow-lg shadow-amber-500/20"
            >
              Yêu Cầu Báo Giá
            </button>
          </div>
        </div>

        {/* Right Sidebar (1 col) */}
        <div className="space-y-6">
          {/* Quick Contact Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Tư Vấn Trực Tiếp 24/7</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Liên hệ ngay thợ kỹ thuật để được giải đáp mọi thắc mắc.</p>
            <a
              href={`tel:${settings.hotline || '0978398567'}`}
              className="block w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm transition-colors shadow-md shadow-amber-500/20"
            >
              {settings.hotline || '0978398567'}
            </a>
          </div>

          {/* Other Services List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
            <h4 className="font-bold text-base text-slate-900 dark:text-white border-l-2 border-amber-500 pl-3">
              Dịch Vụ Khác
            </h4>
            <div className="space-y-2">
              {services.filter(s => s.slug !== slug).map((s) => (
                <Link
                  key={s.id}
                  to={`/dich-vu/${s.slug}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
                >
                  <span className="line-clamp-1">{s.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
