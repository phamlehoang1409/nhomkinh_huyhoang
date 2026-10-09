import React, { useState } from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useSite } from '../../context/SiteContext';
import { ShieldCheck, FileText, ClipboardList } from 'lucide-react';

export default function PolicyPage() {
  const { settings } = useSite();
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb items={[{ label: 'Chính sách & Quy định' }]} />

      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Chính Sách & Quy Trình Dịch Vụ
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Thông tin minh bạch về quy trình tiếp nhận đơn hàng, bảo mật và điều khoản cam kết của Nhôm Kính Huy Hoàng.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'privacy'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Chính sách bảo mật</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'terms'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Điều khoản dịch vụ</span>
        </button>

        <button
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'process'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Quy trình tiếp nhận & báo giá</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 rounded-3xl space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm">
        {activeTab === 'privacy' && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-amber-500 pl-3">
              Chính Sách Bảo Mật Thông Tin Khách Hàng
            </h2>
            <p>
              {settings.policy_privacy ||
                'Nhôm Kính Huy Hoàng cam kết bảo mật tuyệt đối thông tin cá nhân của quý khách (họ tên, số điện thoại, địa chỉ công trình). Mọi thông tin chỉ phục vụ công tác tư vấn, khảo sát thực tế và báo giá thi công.'}
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-amber-500 pl-3">
              Điều Khoản Sử Dụng Dịch Vụ
            </h2>
            <p>
              {settings.policy_terms ||
                'Chúng tôi tiếp nhận đơn hàng, khảo sát công trình thực tế, tư vấn quy cách nhôm kính và ký kết thỏa thuận thi công rõ ràng về chủng loại vật tư, độ dày kính, nguồn gốc phụ kiện chính hãng và thời hạn bảo hành trước khi tiến hành gia công lắp đặt.'}
            </p>
          </div>
        )}

        {activeTab === 'process' && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-amber-500 pl-3">
              Quy Trình Tiếp Nhận & Báo Giá Thi Công
            </h2>
            <p>
              {settings.policy_quote_process ||
                '1. Tiếp nhận yêu cầu khách hàng qua Hotline/Zalo 0978398567 hoặc biểu mẫu website.\n2. Thợ trực tiếp đến tận công trình đo đạc kích thước theo thước Lỗ Ban.\n3. Gửi bảng dự toán báo giá chi tiết, minh bạch, cam kết không phát sinh chi phí vô lý.\n4. Gia công sản xuất tại xưởng bằng máy cắt ghép chuẩn kỹ thuật.\n5. Lắp đặt hoàn thiện, nghiệm thu và bàn giao phiếu bảo hành chu đáo.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
