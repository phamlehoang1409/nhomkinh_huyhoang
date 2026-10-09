import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Eye, ShieldCheck } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function ProductCard({ product }) {
  const { openQuoteModal, settings } = useSite();
  const phone = settings.hotline || '0978398567';

  const defaultImage = 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col group">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
        <img
          src={product.main_image || defaultImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge category or featured */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.category_name && (
            <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
              {product.category_name}
            </span>
          )}
          {product.code && (
            <span className="bg-slate-900/90 text-slate-300 text-[11px] font-semibold px-2 py-1 rounded-lg">
              {product.code}
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <Link
          to={`/san-pham/${product.slug}`}
          className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold"
        >
          <span className="p-2.5 rounded-xl bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-4 h-4" />
            <span>Xem chi tiết</span>
          </span>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <Link to={`/san-pham/${product.slug}`}>
            <h3 className="font-bold text-base text-white hover:text-amber-400 transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Đơn giá</span>
            <span className="font-bold text-amber-400 text-sm">
              {product.price_text || 'Liên hệ báo giá'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openQuoteModal({ service_name: product.name, note: `Yêu cầu báo giá sản phẩm: ${product.name} (Mã: ${product.code || 'N/A'})` })}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors"
            >
              Báo giá
            </button>
            <a
              href={`tel:${phone}`}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
              title={`Gọi tư vấn ${phone}`}
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
