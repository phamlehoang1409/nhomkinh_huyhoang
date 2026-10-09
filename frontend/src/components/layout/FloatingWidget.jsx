import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp, MessageCircle } from 'lucide-react';
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
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {/* Zalo Button */}
        <a
          href={`https://zalo.me/${zaloPhone.replace(/\s+/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
          title="Chat Zalo ngay"
        >
          <span className="font-black text-xs">Zalo</span>
          {/* Tooltip */}
          <span className="absolute right-14 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat Zalo tư vấn
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
          {/* Tooltip */}
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
  );
}
