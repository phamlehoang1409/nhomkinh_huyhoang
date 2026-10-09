import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Clock, Search, Menu, X, ChevronDown, DoorClosed, Moon, Sun } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { settings, categories, services, openQuoteModal } = useSite();
  const { theme, isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    
    // Secret shortcut: Ctrl + Shift + A or Alt + A to open Admin Login
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        navigate('/admin/login');
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  // Secret Triple-click on Logo to access Admin
  const handleLogoClick = (e) => {
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        e.preventDefault();
        navigate('/admin/login');
        return 0;
      }
      setTimeout(() => setLogoClickCount(0), 1500);
      return next;
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchKeyword.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `font-semibold text-sm xl:text-[15px] transition-colors py-2 px-3 rounded-lg flex items-center gap-1 ${
      isActive
        ? 'text-amber-500 dark:text-amber-400 bg-slate-100 dark:bg-slate-800/80 font-bold'
        : 'text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
    }`;

  return (
    <header className="w-full sticky top-0 z-40 transition-all duration-300">
      {/* Top Bar - Thông tin liên hệ nhanh */}
      <div className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs sm:text-sm border-b border-slate-200 dark:border-slate-800 py-1.5 sm:py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
              <span className="truncate max-w-[230px] sm:max-w-none">Thôn Tân Thành, Thọ Hải, Thọ Xuân, Thanh Hóa</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{settings.opening_hours || '07:00 - 18:30 (Cả T7 & CN)'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 ml-auto">
            <a
              href={`tel:${settings.hotline || '0978398567'}`}
              className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors text-xs sm:text-sm"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Hotline / Zalo: {settings.hotline || '0978398567'}</span>
            </a>

            {/* Dark / Light Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105 transition-all flex items-center gap-1 text-xs"
              title={isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối (Dark mode)'}
              aria-label="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              <span className="hidden sm:inline font-semibold">{isDark ? 'Sáng' : 'Tối'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg py-2.5 sm:py-3'
          : 'bg-white dark:bg-slate-900 py-3 sm:py-4'
      } border-b border-slate-200 dark:border-slate-800`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2.5 sm:gap-3 group shrink-0" title="Nhôm Kính Huy Hoàng">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <DoorClosed className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="block font-black text-lg sm:text-2xl tracking-wide uppercase bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-yellow-200 dark:to-amber-500 bg-clip-text text-transparent">
                HUY HOÀNG
              </span>
              <span className="block text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase -mt-1">
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
                <div className="absolute top-full left-0 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Dịch vụ thi công
                  </div>
                  {services.map((s) => (
                    <Link
                      key={s.id}
                      to={`/dich-vu/${s.slug}`}
                      className="block px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                      onClick={() => setServicesDropdown(false)}
                    >
                      {s.name}
                    </Link>
                  ))}
                  <Link
                    to="/dich-vu"
                    className="block px-4 py-2 mt-1 text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold text-center bg-slate-50 dark:bg-slate-800/50"
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
                <div className="absolute top-full left-0 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Danh mục sản phẩm
                  </div>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      to={`/san-pham?danh-muc=${c.slug}`}
                      className="flex items-center justify-between px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                      onClick={() => setProductsDropdown(false)}
                    >
                      <span>{c.name}</span>
                      {c.product_count !== undefined && (
                        <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                          {c.product_count}
                        </span>
                      )}
                    </Link>
                  ))}
                  <Link
                    to="/san-pham"
                    className="block px-4 py-2 mt-1 text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold text-center bg-slate-50 dark:bg-slate-800/50"
                    onClick={() => setProductsDropdown(false)}
                  >
                    Xem tất cả sản phẩm →
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/cong-trinh" className={navLinkClasses}>Công trình</NavLink>
            <NavLink to="/tin-tuc" className={navLinkClasses}>Tin tức</NavLink>
            <NavLink to="/lien-he" className={navLinkClasses}>Liên hệ</NavLink>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Tìm kiếm sản phẩm, dịch vụ"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Request Quote Button */}
            <button
              onClick={() => openQuoteModal()}
              className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Nhận báo giá</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-3 px-4 transition-all">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm cửa nhôm xingfa, kính cường lực, vách ngăn, bài viết..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl pl-11 pr-24 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all shadow-inner"
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
        <div className="lg:hidden fixed inset-0 top-[96px] sm:top-[104px] bg-white/98 dark:bg-slate-950/98 backdrop-blur-md z-40 overflow-y-auto p-4 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, dịch vụ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>

          <nav className="flex flex-col space-y-1 text-slate-700 dark:text-slate-200 font-semibold text-sm">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-2.5 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/gioi-thieu"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-2.5 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              Giới thiệu
            </NavLink>
            <NavLink
              to="/dich-vu"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-2.5 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              Dịch vụ thi công
            </NavLink>
            <NavLink
              to="/san-pham"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-2.5 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              Sản phẩm & Mẫu cửa
            </NavLink>
            <NavLink
              to="/cong-trinh"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-2.5 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              Công trình thực tế
            </NavLink>
            <NavLink
              to="/tin-tuc"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-2.5 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              Tin tức & Kinh nghiệm
            </NavLink>
            <NavLink
              to="/lien-he"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-2.5 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              Liên hệ trực tiếp
            </NavLink>
          </nav>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openQuoteModal();
              }}
              className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-center shadow-lg shadow-amber-500/20 text-xs sm:text-sm"
            >
              📋 Yêu cầu Tư vấn & Báo giá miễn phí
            </button>
            <a
              href={`tel:${settings.hotline || '0978398567'}`}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-bold text-center flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi Hotline: {settings.hotline || '0978398567'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
