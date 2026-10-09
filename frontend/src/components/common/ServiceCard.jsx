import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Shield, Wrench, Layers, DoorClosed, Maximize, ShieldCheck, ClipboardList } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const iconMap = {
  DoorClosed: DoorClosed,
  Maximize: Maximize,
  Layers: Layers,
  ShieldCheck: ShieldCheck,
  Wrench: Wrench,
  ClipboardList: ClipboardList,
  Shield: Shield
};

export default function ServiceCard({ service }) {
  const { openQuoteModal } = useSite();
  const IconComponent = iconMap[service.icon] || Wrench;
  const defaultImage = 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-amber-500/10 transition-all duration-300 flex flex-col group">
      {/* Service Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={service.image || defaultImage}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          <Link to={`/dich-vu/${service.slug}`}>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors mb-2">
              {service.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
            {service.short_desc}
          </p>

          {/* Benefits Preview */}
          {Array.isArray(service.benefits) && service.benefits.length > 0 && (
            <div className="space-y-1.5 mb-4">
              {service.benefits.slice(0, 2).map((b, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 mt-auto">
          <Link
            to={`/dich-vu/${service.slug}`}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 group/btn"
          >
            <span>Chi tiết</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => openQuoteModal({ service_name: service.name, note: `Yêu cầu tư vấn dịch vụ: ${service.name}` })}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition-colors"
          >
            Nhận báo giá
          </button>
        </div>
      </div>
    </div>
  );
}
