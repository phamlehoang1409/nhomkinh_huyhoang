import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductBySlug, fetchSimilarProducts } from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductCard from '../../components/common/ProductCard';
import { Phone, ShieldCheck, CheckCircle2, MessageSquare, Send, ArrowRight, Layers, Tag } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { settings, openQuoteModal } = useSite();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetchProductBySlug(slug);
        if (res.data?.success) {
          const prod = res.data.data;
          setProduct(prod);
          setActiveImage(prod.main_image || '');

          // Load similar products
          if (prod.id) {
            const simRes = await fetchSimilarProducts(prod.id, 4);
            if (simRes.data?.success) {
              setSimilarProducts(simRes.data.data);
            }
          }
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Đang tải thông tin sản phẩm...</div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Không tìm thấy sản phẩm</h2>
        <p className="text-sm text-slate-400">Sản phẩm này có thể đã được cập nhật hoặc không tồn tại.</p>
        <Link to="/san-pham" className="inline-block px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm">
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const allImages = [
    ...(product.main_image ? [product.main_image] : []),
    ...(Array.isArray(product.gallery_images) ? product.gallery_images.filter(img => img !== product.main_image) : [])
  ];

  const defaultImage = 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80';
  const displayImage = activeImage || product.main_image || defaultImage;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <Breadcrumb
        items={[
          { label: 'Sản phẩm', link: '/san-pham' },
          ...(product.category_name ? [{ label: product.category_name, link: `/san-pham?danh-muc=${product.category_slug}` }] : []),
          { label: product.name }
        ]}
      />

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Images Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative">
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.code && (
              <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-500/30">
                Mã: {product.code}
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    displayImage === img ? 'border-amber-500 scale-105 shadow-md shadow-amber-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} - ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {product.category_name && (
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                {product.category_name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price strip */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="block text-xs text-slate-400 uppercase">Giá tham khảo / Báo giá</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">
                {product.price_text || 'Liên hệ báo giá'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
              Theo kích thước thực tế
            </span>
          </div>

          {/* Short description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Specifications Table */}
          {product.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Thông Số Kỹ Thuật</span>
              </h3>
              <div className="divide-y divide-slate-800 text-xs text-slate-300">
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <div key={idx} className="py-2 flex justify-between gap-4">
                    <span className="text-slate-400 font-medium">{key}</span>
                    <span className="text-white font-semibold text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => openQuoteModal({ service_name: product.name, note: `Yêu cầu báo giá chi tiết sản phẩm: ${product.name} (Mã: ${product.code || 'N/A'})` })}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:opacity-95 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Yêu Cầu Báo Giá Sản Phẩm Này</span>
            </button>

            <a
              href={`tel:${settings.hotline || '0978398567'}`}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Gọi tư vấn ngay: {settings.hotline || '0978398567'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Detailed Description */}
      {product.details && (
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-4">
          <h2 className="text-xl font-bold text-white border-l-2 border-amber-500 pl-3">
            Chi Tiết Sản Phẩm & Ứng Dụng Thực Tế
          </h2>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
            {product.details}
          </div>
        </section>
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Sản Phẩm Tương Tự
            </h2>
            <Link
              to="/san-pham"
              className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
