import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Clock, Search, Menu, X, Shield, ChevronDown, Wrench, Layers, DoorClosed } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function Header() {
  const { settings, categories, services, openQuoteModal } = useSite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchKeyword.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `font-semibold text-[15px] transition-colors py-2 px-3 rounded-lg flex items-center gap-1 ${
      isActive
        ? 'text-amber-400 bg-slate-800/80 font-bold'
        : 'text-slate-200 hover:text-amber-400 hover:bg-slate-800/50'
    }`;

  return (
    <header className="w-full sticky top-0 z-50 transition-all duration-300">
      {/* Top Bar - Thông tin liên hệ nhanh */}
      <div className="bg-slate-950 text-slate-300 text-xs sm:text-sm border-b border-slate-800 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Thôn Tân Thành, Thọ Hải, Thọ Xuân, Thanh Hóa</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{settings.opening_hours || '07:00 - 18:30 (Thứ 2 - Chủ Nhật)'}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-5 ml-auto">
            <a
              href={`tel:${settings.hotline || '0978398567'}`}
              className="flex items-center gap-1.5 font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Hotline / Zalo: {settings.hotline || '0978398567'}</span>
            </a>
            <Link
              to="/admin/login"
              className="hidden lg:inline-block text-slate-400 hover:text-slate-200 text-xs border-l border-slate-700 pl-4"
            >
              Quản trị
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-xl py-3' : 'bg-slate-900 py-4'} border-b border-slate-800`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <DoorClosed className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="block font-black text-xl sm:text-2xl tracking-wide uppercase bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                HUY HOÀNG
              </span>
              <span className="block text-[11px] font-semibold tracking-widest text-slate-400 uppercase -mt-1">
                Nhôm Kính Thanh Hóa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" end className={navLinkClasses}>Trang chủ</NavLink>
            <NavLink to="/gioi-thieu" className={navLinkClasses}>Giới thiệu</NavLink>

            {/* Dịch vụ Menu */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <NavLink to="/dich-vu" className={navLinkClasses}>
                <span>Dịch vụ</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </NavLink>
              {servicesDropdown && (
                <div className="absolute top-full left-0 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-amber-400">
                    Dịch vụ thi công
                  </div>
                  {services.map((s) => (
                    <Link
                      key={s.id}
                      to={`/dich-vu/${s.slug}`}
                      className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors"
                      onClick={() => setServicesDropdown(false)}
                    >
                      {s.name}
                    </Link>
                  ))}
                  <Link
                    to="/dich-vu"
                    className="block px-4 py-2 mt-1 text-xs text-amber-400 hover:underline font-semibold text-center bg-slate-800/50"
                    onClick={() => setServicesDropdown(false)}
                  >
                    Xem tất cả dịch vụ →
                  </Link>
                </div>
              )}
            </div>

            {/* Sản phẩm Menu */}
            <div
              className="relative"
              onMouseEnter={() => setProductsDropdown(true)}
              onMouseLeave={() => setProductsDropdown(false)}
            >
              <NavLink to="/san-pham" className={navLinkClasses}>
                <span>Sản phẩm</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </NavLink>
              {productsDropdown && (
                <div className="absolute top-full left-0 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-amber-400">
                    Danh mục sản phẩm
                  </div>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      to={`/san-pham?danh-muc=${c.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors"
                      onClick={() => setProductsDropdown(false)}
                    >
                      <span>{c.name}</span>
                      {c.product_count !== undefined && (
                        <span className="text-[11px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full">
                          {c.product_count}
                        </span>
                      )}
                    </Link>
                  ))}
                  <Link
                    to="/san-pham"
                    className="block px-4 py-2 mt-1 text-xs text-amber-400 hover:underline font-semibold text-center bg-slate-800/50"
                    onClick={() => setProductsDropdown(false)}
                  >
                    Xem tất cả sản phẩm →
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/cong-trinh" className={navLinkClasses}>Công trình</NavLink>
            <NavLink to="/tin-tuc" className={navLinkClasses}>Tin tức & Mẹo</NavLink>
            <NavLink to="/lien-he" className={navLinkClasses}>Liên hệ</NavLink>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="Tìm kiếm sản phẩm, dịch vụ"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Request Quote Button */}
            <button
              onClick={() => openQuoteModal()}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Nhận báo giá</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="bg-slate-950 border-t border-slate-800 py-3 px-4 transition-all">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm cửa nhôm xingfa, kính cường lực, vách ngăn, bài viết..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl pl-11 pr-24 py-2.5 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-inner"
                  autoFocus
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Tìm ngay
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[108px] bg-slate-950/95 backdrop-blur-md z-40 overflow-y-auto p-4 border-t border-slate-800 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, dịch vụ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </form>

          <nav className="flex flex-col space-y-1 text-slate-200 font-medium">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-slate-900'}`}
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/gioi-thieu"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-slate-900'}`}
            >
              Giới thiệu
            </NavLink>
            <NavLink
              to="/dich-vu"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-slate-900'}`}
            >
              Dịch vụ thi công
            </NavLink>
            <NavLink
              to="/san-pham"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-slate-900'}`}
            >
              Sản phẩm & Báo giá
            </NavLink>
            <NavLink
              to="/cong-trinh"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-slate-900'}`}
            >
              Công trình thực tế
            </NavLink>
            <NavLink
              to="/tin-tuc"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-slate-900'}`}
            >
              Tin tức & Kinh nghiệm
            </NavLink>
            <NavLink
              to="/lien-he"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-slate-900'}`}
            >
              Liên hệ trực tiếp
            </NavLink>
          </nav>

          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openQuoteModal();
              }}
              className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-center shadow-lg shadow-amber-500/20"
            >
              Yêu cầu tư vấn & Báo giá miễn phí
            </button>
            <a
              href={`tel:${settings.hotline || '0978398567'}`}
              className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-bold text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi ngay: {settings.hotline || '0978398567'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
