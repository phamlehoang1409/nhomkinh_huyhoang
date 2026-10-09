import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductCard from '../../components/common/ProductCard';
import Pagination from '../../components/common/Pagination';
import { Search, Filter, SlidersHorizontal, PackageX } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useSite();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });

  const currentCategorySlug = searchParams.get('danh-muc') || '';
  const currentSearch = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('trang') || '1', 10);

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          category_slug: currentCategorySlug || undefined,
          search: currentSearch || undefined,
          sort: currentSort
        };
        const res = await fetchProducts(params);
        if (res.data?.success) {
          setProducts(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [currentCategorySlug, currentSearch, currentSort, currentPage]);

  const handleCategorySelect = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('danh-muc', slug);
    } else {
      params.delete('danh-muc');
    }
    params.set('trang', '1');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('q', searchInput.trim());
    } else {
      params.delete('q');
    }
    params.set('trang', '1');
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    params.set('trang', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('trang', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Sản phẩm', link: currentCategorySlug ? '/san-pham' : undefined },
          ...(currentCategorySlug ? [{ label: categories.find(c => c.slug === currentCategorySlug)?.name || currentCategorySlug }] : [])
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            DANH MỤC CỬA & PHỤ KIỆN
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {currentCategorySlug
              ? categories.find(c => c.slug === currentCategorySlug)?.name || 'Sản Phẩm Nhôm Kính'
              : 'Tất Cả Sản Phẩm Nhôm Kính'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Hiển thị <strong>{pagination.total}</strong> sản phẩm mẫu chuẩn
        </p>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (1 col) */}
        <div className="space-y-6">
          {/* Search Box */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              Tìm kiếm sản phẩm
            </h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Mã hoặc tên cửa..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:border-amber-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Category Tabs */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Danh mục sản phẩm</span>
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between ${
                  !currentCategorySlug
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Tất cả sản phẩm</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategorySelect(c.slug)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between ${
                    currentCategorySlug === c.slug
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="line-clamp-1">{c.name}</span>
                  {c.product_count !== undefined && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      {c.product_count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-xs text-slate-400">
              {currentSearch && (
                <span>Kết quả cho: <strong className="text-amber-400">"{currentSearch}"</strong></span>
              )}
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sắp xếp:</span>
              </span>
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="name_asc">Tên (A-Z)</option>
                <option value="name_desc">Tên (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Products List */}
          {loading ? (
            <div className="text-center py-20 text-slate-400 text-sm">
              Đang tải danh sách sản phẩm...
            </div>
          ) : products.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <PackageX className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Quý khách vui lòng thử tìm với từ khóa khác hoặc liên hệ trực tiếp hotline để được tư vấn mẫu mã theo yêu cầu riêng.
              </p>
              <button
                onClick={() => {
                  setSearchParams({});
                  setSearchInput('');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
