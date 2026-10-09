import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Phone, CheckCircle2, Award, Clock, Wrench, Sparkles,
  ArrowRight, ChevronRight, HelpCircle, Star, Quote, MapPin, Layers, DoorClosed
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { fetchFeaturedProducts, fetchFeaturedServices, fetchProjects, fetchArticles, fetchReviews } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import ServiceCard from '../../components/common/ServiceCard';
import ProjectCard from '../../components/common/ProjectCard';
import ArticleCard from '../../components/common/ArticleCard';

export default function HomePage() {
  const { settings, openQuoteModal } = useSite();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, servRes, projRes, artRes, revRes] = await Promise.all([
          fetchFeaturedProducts(8).catch(() => ({ data: { data: [] } })),
          fetchFeaturedServices().catch(() => ({ data: { data: [] } })),
          fetchProjects({ limit: 3 }).catch(() => ({ data: { data: [] } })),
          fetchArticles({ limit: 3 }).catch(() => ({ data: { data: [] } })),
          fetchReviews().catch(() => ({ data: { data: [] } }))
        ]);

        if (prodRes.data?.data) setFeaturedProducts(prodRes.data.data);
        if (servRes.data?.data) setFeaturedServices(servRes.data.data);
        if (projRes.data?.data) setFeaturedProjects(projRes.data.data);
        if (artRes.data?.data) setLatestArticles(artRes.data.data);
        if (revRes.data?.data) setReviews(revRes.data.data);
      } catch (err) {
        console.error('Home data load error:', err);
      }
    }
    loadData();
  }, []);

  const faqs = [
    {
      q: 'Nhôm Kính Huy Hoàng có hỗ trợ khảo sát và đo đạc tận nơi không?',
      a: 'Có. Chúng tôi hỗ trợ mang mẫu nhôm, phụ kiện và thước đo đến tận công trình của quý khách tại khu vực Thọ Xuân và các huyện lân cận thuộc tỉnh Thanh Hóa hoàn toàn miễn phí.'
    },
    {
      q: 'Cửa nhôm Xingfa tại cơ sở có phải chính hãng không và bảo hành bao lâu?',
      a: 'Tất cả sản phẩm nhôm Xingfa do Huy Hoàng cung cấp đều sử dụng thanh profile nhôm Xingfa tem đỏ chính hãng, phụ kiện đồng bộ Kinlong/Draho. Thời gian bảo hành nhôm là 5 năm và bảo hành phụ kiện 2 năm đổi mới.'
    },
    {
      q: 'Thời gian sản xuất và thi công lắp đặt mất bao lâu?',
      a: 'Sau khi thống nhất bản vẽ kích thước và phương án thi công, thời gian gia công tại xưởng từ 2 - 4 ngày và thời gian lắp đặt hoàn thiện tại công trình từ 1 - 2 ngày tùy theo khối lượng cửa.'
    },
    {
      q: 'Tôi muốn nhận báo giá sơ bộ thì cần cung cấp những thông tin gì?',
      a: 'Quý khách chỉ cần cung cấp kích thước dự kiến (rộng x cao), số lượng cửa hoặc bản vẽ thiết kế qua Zalo/Hotline 0978398567 hoặc form nhận báo giá trên website để nhận dự toán chi tiết.'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center bg-slate-950 overflow-hidden">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Cơ sở Nhôm Kính Huy Hoàng Thanh Hóa"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>CƠ SỞ NHÔM KÍNH UY TÍN TẠI THANH HÓA</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Chuyên Gia Công & Thi Công{' '}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                Cửa Nhôm Kính Cao Cấp
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Cơ sở <strong>Nhôm Kính Huy Hoàng</strong> chuyên sản xuất, lắp đặt cửa nhôm Xingfa nhập khẩu, cửa kính cường lực, vách kính, lan can & mái kính đẹp chuẩn kỹ thuật, bảo hành lâu dài tại Thọ Xuân và toàn tỉnh Thanh Hóa.
            </p>

            {/* Quick Benefits Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Nhôm Xingfa chính hãng</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Khảo sát đo đạc tận nơi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Giá tại xưởng không qua trung gian</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => openQuoteModal()}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 font-black text-sm sm:text-base hover:shadow-xl hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Nhận Báo Giá Miễn Phí</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${settings.hotline || '0978398567'}`}
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Gọi Hotline: {settings.hotline || '0978398567'}</span>
              </a>

              <Link
                to="/cong-trinh"
                className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 underline font-semibold transition-colors ml-1"
              >
                Xem công trình đã làm →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS STRIP */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 sm:-mt-14 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Chất lượng cam kết</h4>
              <p className="text-xs text-slate-400">Vật tư nhôm, kính và phụ kiện đúng quy cách, chính hãng 100%.</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Thợ tay nghề cao</h4>
              <p className="text-xs text-slate-400">Gia công góc cắt sắc nét, đường keo kín khít chống nước triệt để.</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Đúng tiến độ</h4>
              <p className="text-xs text-slate-400">Sản xuất và lắp đặt nhanh chóng, bàn giao đúng hẹn thỏa thuận.</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Bảo hành dài hạn</h4>
              <p className="text-xs text-slate-400">Hỗ trợ kỹ thuật và bảo trì định kỳ chu đáo, tận tâm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            HẠNG MỤC THI CÔNG
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            Dịch Vụ Nhôm Kính Chuyên Nghiệp
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3">
            Đầy đủ các giải pháp nhôm kính cho nhà phố, biệt thự, văn phòng, cửa hàng tại Thanh Hóa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/dich-vu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 font-bold text-sm transition-colors"
          >
            <span>Xem tất cả dịch vụ</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. POPULAR PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 bg-slate-900/40 p-6 sm:p-10 rounded-3xl border border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              MẪU CỬA ĐẸP & HIỆN ĐẠI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Sản Phẩm Được Quan Tâm Nhiều
            </h2>
          </div>
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300"
          >
            <span>Xem toàn bộ danh mục</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. 5-STEP WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            QUY TRÌNH CHUẨN KỸ THUẬT
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            5 Bước Làm Việc Chuyên Nghiệp
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Tiếp nhận & Tư vấn', desc: 'Lắng nghe yêu cầu, tư vấn hệ nhôm, quy cách mở cửa phù hợp kiến trúc.' },
            { step: '02', title: 'Khảo sát đo đạc', desc: 'Thợ trực tiếp đến công trình đo kích thước Lỗ Ban phong thủy chuẩn xác.' },
            { step: '03', title: 'Báo giá & Chốt mẫu', desc: 'Lập bảng dự toán chi tiết, minh bạch vật tư, không phát sinh chi phí.' },
            { step: '04', title: 'Gia công sản xuất', desc: 'Cắt ghép góc ép thủy lực kín khít bằng máy móc chuyên dụng tại xưởng.' },
            { step: '05', title: 'Lắp đặt & Bảo hành', desc: 'Vận chuyển, lắp ráp hoàn thiện, kiểm tra vận hành và bàn giao phiếu bảo hành.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative flex flex-col justify-between group hover:border-amber-500/50 transition-colors">
              <div>
                <span className="text-3xl font-black text-amber-500/30 group-hover:text-amber-500 transition-colors block mb-3">
                  {item.step}
                </span>
                <h3 className="font-bold text-base text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FEATURED COMPLETED PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
                HÌNH ẢNH THỰC TẾ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Công Trình Đã Thi Công
              </h2>
            </div>
            <Link
              to="/cong-trinh"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300"
            >
              <span>Xem thêm công trình</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* 7. CUSTOMER REVIEWS & FAQ */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Reviews */}
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Ý KIẾN KHÁCH HÀNG
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
              Khách Hàng Đánh Giá
            </h2>

            <div className="space-y-4">
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">{r.address_or_role}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{r.comment}"
                  </p>
                  <p className="font-bold text-xs text-amber-400">{r.customer_name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              GIẢI ĐÁP THẮC MẮC
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
              Câu Hỏi Thường Gặp
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full text-left p-4 font-bold text-sm text-white flex items-center justify-between gap-3 hover:text-amber-400"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-amber-400 transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. LATEST ARTICLES */}
      {latestArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
                KIẾN THỨC & MẸO HAY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Kinh Nghiệm Nhôm Kính
              </h2>
            </div>
            <Link
              to="/tin-tuc"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300"
            >
              <span>Xem tất cả bài viết</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* 9. BOTTOM BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 rounded-3xl p-8 sm:p-12 text-slate-950 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black">
              Cần Khảo Sát & Báo Giá Cửa Nhôm Kính?
            </h2>
            <p className="text-sm font-medium text-slate-900 leading-relaxed">
              Hãy liên hệ với Nhôm Kính Huy Hoàng ngay hôm nay để được tư vấn kích thước Lỗ Ban, mẫu mã phù hợp và nhận báo giá ưu đãi nhất tại Thọ Xuân, Thanh Hóa.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <button
              onClick={() => openQuoteModal()}
              className="px-7 py-3.5 bg-slate-950 text-white hover:bg-slate-900 font-bold rounded-xl text-sm shadow-xl transition-all"
            >
              Yêu Cầu Báo Giá
            </button>
            <a
              href={`tel:${settings.hotline || '0978398567'}`}
              className="px-7 py-3.5 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-xl text-sm shadow-xl flex items-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Gọi: {settings.hotline || '0978398567'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
