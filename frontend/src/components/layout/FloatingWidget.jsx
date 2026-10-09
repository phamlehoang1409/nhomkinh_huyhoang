import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp, MessageCircle, FileText, Bot } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function FloatingWidget() {
  const { settings, openQuoteModal } = useSite();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phone = settings.hotline || '0978398567';
  const zaloPhone = settings.zalo || '0978398567';

  return (
    <>
      {/* Desktop Floating Right Widgets */}
      <div className="hidden sm:flex fixed bottom-6 right-4 sm:right-6 z-40 flex-col items-end gap-3 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          {/* Zalo Button */}
          <a
            href={`https://zalo.me/${zaloPhone.replace(/\s+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
            title="Chat Zalo tư vấn với Chủ xưởng"
          >
            <span className="font-black text-xs">Zalo</span>
            <span className="absolute right-14 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Zalo Chủ Xưởng ({phone})
            </span>
          </a>

          {/* Floating Call Button with pulse ring */}
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-xl hover:scale-110 active:scale-95 transition-all"
            title="Gọi hotline ngay"
          >
            <span className="absolute inset-0 rounded-full bg-amber-400 opacity-75 animate-ping -z-10"></span>
            <Phone className="w-5 h-5 text-slate-950 animate-bounce" />
            <span className="absolute right-14 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Gọi ngay: {phone}
            </span>
          </a>

          {/* Scroll To Top Button */}
          {showTopBtn && (
            <button
              onClick={scrollToTop}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-800 text-amber-400 border border-slate-700 shadow-md hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all"
              title="Về đầu trang"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Fixed Bottom Action Bar (Cố định góc dưới cho điện thoại di động) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800 py-2 px-3 flex items-center justify-around shadow-2xl">
        {/* Call Hotline */}
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="flex flex-col items-center justify-center gap-1 text-amber-400 font-bold text-[11px] hover:scale-105 transition-transform"
        >
          <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md animate-pulse">
            <Phone className="w-4 h-4" />
          </div>
          <span>Gọi điện</span>
        </a>

        {/* Zalo Owner */}
        <a
          href={`https://zalo.me/${zaloPhone.replace(/\s+/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 text-blue-400 font-bold text-[11px] hover:scale-105 transition-transform"
        >
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
            <span className="text-[10px] font-black">Zalo</span>
          </div>
          <span>Chat Zalo</span>
        </a>

        {/* Request Quote Modal Button */}
        <button
          onClick={() => openQuoteModal()}
          className="flex flex-col items-center justify-center gap-1 text-emerald-400 font-bold text-[11px] hover:scale-105 transition-transform"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
            <FileText className="w-4 h-4" />
          </div>
          <span>Báo giá</span>
        </button>

        {/* Scroll To Top */}
        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="flex flex-col items-center justify-center gap-1 text-slate-400 text-[11px]"
          >
            <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center">
              <ArrowUp className="w-4 h-4" />
            </div>
            <span>Lên đầu</span>
          </button>
        )}
      </div>
    </>
  );
}
