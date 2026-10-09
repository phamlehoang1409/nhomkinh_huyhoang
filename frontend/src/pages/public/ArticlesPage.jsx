import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchArticles, fetchArticleCategories } from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import ArticleCard from '../../components/common/ArticleCard';
import Pagination from '../../components/common/Pagination';
import { Search, Tag, BookOpen } from 'lucide-react';

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });

  const currentCategory = searchParams.get('danh-muc') || '';
  const currentSearch = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('trang') || '1', 10);
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchArticleCategories();
        if (res.data?.success) setCategories(res.data.data);
      } catch (err) {
        console.error('Error loading article categories:', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 9,
          category_id: currentCategory || undefined,
          search: currentSearch || undefined
        };
        const res = await fetchArticles(params);
        if (res.data?.success) {
          setArticles(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [currentCategory, currentSearch, currentPage]);

  const handleCategorySelect = (id) => {
    const params = new URLSearchParams(searchParams);
    if (id) params.set('danh-muc', id.toString());
    else params.delete('danh-muc');
    params.set('trang', '1');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) params.set('q', searchInput.trim());
    else params.delete('q');
    params.set('trang', '1');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb items={[{ label: 'Tin tức & Kinh nghiệm' }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
          CẨM NANG NHÔM KÍNH
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Kinh Nghiệm, Tư Vấn & Hướng Dẫn
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Chia sẻ kiến thức bổ ích về cách chọn cửa nhôm Xingfa chính hãng, bảo quản cửa kính, mẹo phong thủy cửa chính và kỹ thuật thi công chuẩn.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              !currentCategory
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Tất cả bài viết
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategorySelect(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                currentCategory === c.id.toString()
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm bài viết..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">Đang tải bài viết...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
          Không tìm thấy bài viết nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => {
          const params = new URLSearchParams(searchParams);
          params.set('trang', p.toString());
          setSearchParams(params);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
