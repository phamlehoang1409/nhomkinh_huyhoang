import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Wrench, CheckCircle2, Phone, MapPin, Clock, DoorClosed, Layers } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useSite } from '../../context/SiteContext';

export default function AboutPage() {
  const { settings, openQuoteModal } = useSite();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <Breadcrumb items={[{ label: 'Giới thiệu' }]} />

      {/* Hero Intro */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 overflow-hidden relative">
        <div className="max-w-3xl space-y-6">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            CƠ SỞ NHÔM KÍNH HUY HOÀNG
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Giải Pháp Cửa & Nhôm Kính Vững Chắc Cho Mọi Ngôi Nhà
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Cơ sở <strong>Nhôm Kính Huy Hoàng</strong> tọa lạc tại Thôn Tân Thành, xã Thọ Hải, huyện Thọ Xuân, tỉnh Thanh Hóa. Chúng tôi tự hào là đơn vị uy tín chuyên tư vấn thiết kế, gia công sản xuất và thi công lắp đặt các sản phẩm nhôm kính chất lượng cao cho các công trình nhà ở gia đình, nhà phố, biệt thự và cơ sở kinh doanh.
          </p>
        </div>
      </section>

      {/* Core Values & Working Philosophy */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4 hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-white">Chất Lượng Thật</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Chúng tôi cam kết sử dụng nhôm Xingfa nhập khẩu tem đỏ chính hãng, kính cường lực chuẩn an toàn và phụ kiện kim khí đồng bộ. Nói không với vật liệu pha tạp hoặc phụ kiện kém chất lượng.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4 hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-white">Tay Nghề Thợ Vững</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Đội ngũ thợ có tay nghề vững vàng, am hiểu kỹ thuật ép góc thủy lực, lắp đặt cân chỉnh bản lề êm ái, bắn keo silicone chuẩn phẳng và xử lý kín khít chống thấm nước tuyệt đối.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4 hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-white">Giá Tốt Tại Xưởng</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Gia công trực tiếp tại xưởng sản xuất, không qua các khâu trung gian thương mại, mang đến cho quý khách hàng mức giá hợp lý và dự toán minh bạch nhất.
          </p>
        </div>
      </section>

      {/* Scope of Work */}
      <section className="bg-slate-900/60 border border-slate-800 p-8 sm:p-12 rounded-3xl space-y-8">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            LĨNH VỰC HOẠT ĐỘNG
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Các Hạng Mục Thi Công Trọng Tâm
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          {[
            'Cửa đi, cửa sổ nhôm Xingfa hệ 55, hệ 93 nhập khẩu',
            'Cửa kính cường lực mở quay bản lề sàn thủy lực',
            'Cửa kính lùa trượt treo ray Inox chịu lực',
            'Vách kính ngăn phòng làm việc, phòng khách',
            'Cabin phòng tắm kính đứng phụ kiện Inox 304',
            'Lan can ban công kính và cầu thang kính cường lực',
            'Mái kính nghệ thuật sảnh đón, giếng trời',
            'Cửa nhựa lõi thép và các dòng cửa nhôm hệ vát cạnh',
            'Sửa chữa, căn chỉnh cửa xệ cánh và thay thế phụ kiện tận nơi'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Commitments */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Cam Kết Chất Lượng Dịch Vụ
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            1. <strong>Tư vấn trung thực:</strong> Đưa ra giải pháp đúng nhu cầu sử dụng và ngân sách của gia chủ, không mập mờ về chủng loại độ dày nhôm hoặc nguồn gốc kính.
          </p>
          <p>
            2. <strong>Khảo sát kỹ lưỡng:</strong> Trực tiếp đo đạc tại công trình, tư vấn phong thủy kích thước số đẹp thước Lỗ Ban nhằm mang lại may mắn, tài lộc cho gia đình.
          </p>
          <p>
            3. <strong>Bảo hành chu đáo:</strong> Sau khi bàn giao, mọi sự cố kỹ thuật về căn chỉnh cửa, phụ kiện đều được tiếp nhận và xử lý nhanh chóng.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-4">
          <button
            onClick={() => openQuoteModal()}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            Liên Hệ Báo Giá Ngay
          </button>
          <a
            href={`tel:${settings.hotline || '0978398567'}`}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Hotline: {settings.hotline || '0978398567'}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
