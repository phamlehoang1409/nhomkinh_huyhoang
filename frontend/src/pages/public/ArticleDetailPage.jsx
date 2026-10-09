import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleBySlug, fetchArticles } from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import { Calendar, Eye, User, ArrowLeft, Share2, Tag, ChevronRight, Phone } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { settings, openQuoteModal } = useSite();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetchArticleBySlug(slug);
        if (res.data?.success) {
          setArticle(res.data.data);

          // Fetch related
          const relRes = await fetchArticles({ limit: 4 });
          if (relRes.data?.success) {
            setRelatedArticles(relRes.data.data.filter(a => a.slug !== slug));
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
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Đang tải nội dung bài viết...</div>;
  }

  if (error || !article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Không tìm thấy bài viết</h2>
        <p className="text-sm text-slate-400">Bài viết này không tồn tại hoặc đã được chuyển địa chỉ.</p>
        <Link to="/tin-tuc" className="inline-block px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm">
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Tin tức & Kinh nghiệm', link: '/tin-tuc' },
          { label: article.title }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content (2 cols) */}
        <article className="lg:col-span-2 space-y-8 bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-3xl">
          {/* Header */}
          <div className="space-y-4">
            {article.category_name && (
              <span className="inline-block bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1 rounded-lg border border-amber-500/30">
                {article.category_name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {article.title}
            </h1>

            {/* Metadata bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500" />
                <span>{article.author || 'Nhôm Kính Huy Hoàng'}</span>
              </span>
              {formattedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>{formattedDate}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-500" />
                <span>{article.views || 0} lượt đọc</span>
              </span>
            </div>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <div className="p-4 bg-slate-800/60 rounded-2xl border-l-4 border-amber-500 text-sm sm:text-base text-slate-200 font-medium leading-relaxed italic">
              {article.excerpt}
            </div>
          )}

          {/* Featured Image */}
          {article.thumbnail && (
            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-950">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Body */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
            {article.content}
          </div>

          {/* Share / Contact footer */}
          <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/tin-tuc"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại bài viết khác</span>
            </Link>

            <button
              onClick={() => openQuoteModal({ note: `Tư vấn sau khi đọc bài viết: ${article.title}` })}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm"
            >
              Yêu Cầu Tư Vấn Ngay
            </button>
          </div>
        </article>

        {/* Sidebar (1 col) */}
        <div className="space-y-6">
          {/* Hotline CTA Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-bold text-base text-white">Bạn Cần Hỗ Trợ Kỹ Thuật?</h4>
            <p className="text-xs text-slate-400">
              Gọi ngay hotline thợ trực tiếp khảo sát và tư vấn mọi giải pháp nhôm kính.
            </p>
            <a
              href={`tel:${settings.hotline || '0978398567'}`}
              className="block w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm transition-colors"
            >
              {settings.hotline || '0978398567'}
            </a>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-base text-white border-l-2 border-amber-500 pl-3">
                Bài Viết Cùng Chủ Đề
              </h4>
              <div className="space-y-3">
                {relatedArticles.slice(0, 4).map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/tin-tuc/${rel.slug}`}
                    className="block group p-2 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <h5 className="text-xs font-bold text-slate-300 group-hover:text-amber-400 line-clamp-2 transition-colors">
                      {rel.title}
                    </h5>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(rel.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
