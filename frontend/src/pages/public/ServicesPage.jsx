import React from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import ServiceCard from '../../components/common/ServiceCard';
import { useSite } from '../../context/SiteContext';

export default function ServicesPage() {
  const { services, loading } = useSite();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb items={[{ label: 'Dịch vụ thi công' }]} />

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
          HẠNG MỤC THI CÔNG NHÔM KÍNH
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Dịch Vụ Thi Công & Sửa Chữa Chuyên Nghiệp
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Cơ sở Nhôm Kính Huy Hoàng cung cấp giải pháp trọn gói từ tư vấn thiết kế, gia công sản xuất đến lắp đặt và bảo dưỡng các hạng mục cửa nhôm kính tại Thanh Hóa.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm">Đang tải danh sách dịch vụ...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
