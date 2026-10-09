import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { globalSearch } from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductCard from '../../components/common/ProductCard';
import ServiceCard from '../../components/common/ServiceCard';
import ArticleCard from '../../components/common/ArticleCard';
import { Search, PackageX } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('loai') || 'all';

  const [keyword, setKeyword] = useState(queryParam);
  const [results, setResults] = useState({ products: [], services: [], articles: [], totalResults: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setKeyword(queryParam);
    if (queryParam.trim()) {
      async function doSearch() {
        setLoading(true);
        try {
          const res = await globalSearch({ q: queryParam.trim(), type: typeParam });
          if (res.data?.success) {
            setResults(res.data.data);
          }
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setLoading(false);
        }
      }
      doSearch();
    } else {
      setResults({ products: [], services: [], articles: [], totalResults: 0 });
    }
  }, [queryParam, typeParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      const p = new URLSearchParams(searchParams);
      p.set('q', keyword.trim());
      setSearchParams(p);
    }
  };

  const handleTabChange = (t) => {
    const p = new URLSearchParams(searchParams);
    p.set('loai', t);
    setSearchParams(p);
  };

  const totalResults = (results.products?.length || 0) + (results.services?.length || 0) + (results.articles?.length || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Tìm kiếm' }]} />

      {/* Search Header Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 rounded-3xl space-y-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white text-center">
          Tìm Kiếm Thông Tin
        </h1>

        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative flex items-center">
          <input
            type="text"
            placeholder="Nhập tên sản phẩm, mã cửa, dịch vụ hoặc kinh nghiệm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl pl-11 pr-28 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none shadow-inner"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-colors"
          >
            Tìm kiếm
          </button>
        </form>

        {queryParam && (
          <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Tìm thấy <strong className="text-amber-600 dark:text-amber-400">{totalResults}</strong> kết quả cho từ khóa: <strong className="text-slate-900 dark:text-white">"{queryParam}"</strong>
          </p>
        )}
      </div>

      {/* Tabs */}
      {queryParam && (
        <div className="flex items-center justify-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              typeParam === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tất cả ({totalResults})
          </button>
          <button
            onClick={() => handleTabChange('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              typeParam === 'products'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sản phẩm ({results.products?.length || 0})
          </button>
          <button
            onClick={() => handleTabChange('services')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              typeParam === 'services'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dịch vụ ({results.services?.length || 0})
          </button>
          <button
            onClick={() => handleTabChange('articles')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              typeParam === 'articles'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bài viết ({results.articles?.length || 0})
          </button>
        </div>
      )}

      {/* Results Content */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-sm">Đang tìm kiếm dữ liệu...</div>
      ) : totalResults === 0 && queryParam ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <PackageX className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Không tìm thấy kết quả nào</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Không có sản phẩm, dịch vụ hoặc bài viết nào khớp với từ khóa "{queryParam}". Vui lòng thử lại với từ khóa khác hoặc liên hệ hotline.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Products */}
          {(typeParam === 'all' || typeParam === 'products') && results.products?.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-l-4 border-amber-500 pl-3">
                Sản phẩm tìm thấy ({results.products.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {(typeParam === 'all' || typeParam === 'services') && results.services?.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-l-4 border-amber-500 pl-3">
                Dịch vụ tìm thấy ({results.services.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.services.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {(typeParam === 'all' || typeParam === 'articles') && results.articles?.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-l-4 border-amber-500 pl-3">
                Bài viết & Kinh nghiệm ({results.articles.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.articles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
