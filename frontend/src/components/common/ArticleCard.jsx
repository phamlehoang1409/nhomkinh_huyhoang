import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight } from 'lucide-react';

export default function ArticleCard({ article }) {
  const defaultImage = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-amber-500/10 transition-all duration-300 flex flex-col group">
      {/* Thumbnail */}
      <Link to={`/tin-tuc/${article.slug}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-950 block">
        <img
          src={article.thumbnail || defaultImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {article.category_name && (
          <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
            {article.category_name}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.views || 0} lượt xem</span>
            </span>
          </div>

          {/* Title */}
          <Link to={`/tin-tuc/${article.slug}`}>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors line-clamp-2 mb-2">
              {article.title}
            </h3>
          </Link>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Read More Link */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-auto flex items-center justify-between">
          <span className="text-[11px] text-slate-400">{article.author || 'Huy Hoàng'}</span>
          <Link
            to={`/tin-tuc/${article.slug}`}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 group/btn"
          >
            <span>Đọc tiếp</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
