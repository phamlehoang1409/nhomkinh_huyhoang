import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Clock, ShieldCheck, CheckCircle2, ChevronRight, DoorClosed } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function Footer() {
  const { settings, categories, services } = useSite();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <DoorClosed className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="block font-black text-xl tracking-wide uppercase text-white">
                  HUY HOÀNG
                </span>
                <span className="block text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  Nhôm Kính Thọ Xuân - Thanh Hóa
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Cơ sở chuyên tư vấn thiết kế, gia công và thi công hoàn thiện các hạng mục nhôm kính: Cửa nhôm Xingfa nhập khẩu, cửa kính cường lực, vách ngăn văn phòng, lan can, cầu thang và mái kính uy tín hàng đầu tại Thanh Hóa.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cam kết nhôm chuẩn chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bảo hành dài hạn, khảo sát tận nơi miễn phí</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links & Services */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Dịch vụ nổi bật
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {services.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <Link
                    to={`/dich-vu/${s.slug}`}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                    <span>{s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Sản phẩm & Chính sách
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {categories.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/san-pham?danh-muc=${c.slug}`}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-800/80">
                <Link to="/chinh-sach" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>Chính sách bảo mật & Điều khoản</span>
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>Quy trình tiếp nhận báo giá</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact info & Google Map */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Thông tin liên hệ
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address || 'Thôn Tân Thành, xã Thọ Hải, huyện Thọ Xuân, Thanh Hóa'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <a
                  href={`tel:${settings.hotline || '0978398567'}`}
                  className="text-amber-400 font-bold hover:underline"
                >
                  {settings.hotline || '0978398567'}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{settings.opening_hours || '07:00 - 18:30 hàng ngày'}</span>
              </div>
              {settings.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{settings.email}</span>
                </div>
              )}
            </div>

            {/* Quick Map Embed */}
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-800 h-28 w-full bg-slate-900">
              <iframe
                title="Bản đồ Nhôm Kính Huy Hoàng"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d105.5!3d19.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136500000000000%3A0x0!2zVGjhu40gSOG6o2ksIFRo4buNIFh1w6JuLCBUaGFuaCBIw7Fh!5e0!3m2!1svi!2svn!4v1680000000000!5m2!1svi!2svn"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Nhôm Kính Huy Hoàng - Thọ Xuân, Thanh Hóa. Hotline: {settings.hotline || '0978398567'}.</p>
          <div className="flex items-center space-x-6">
            <Link to="/gioi-thieu" className="hover:text-slate-300">Giới thiệu</Link>
            <Link to="/chinh-sach" className="hover:text-slate-300">Chính sách</Link>
            <Link to="/lien-he" className="hover:text-slate-300">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
