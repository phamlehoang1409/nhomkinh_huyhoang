import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, FolderKanban, Wrench, Building2,
  FileText, MessageSquare, Star, Settings, User, LogOut, Menu, X, ExternalLink, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchDashboardStats } from '../../services/api';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newQuotesCount, setNewQuotesCount] = useState(0);

  useEffect(() => {
    async function loadBadge() {
      try {
        const res = await fetchDashboardStats();
        if (res.data?.success && res.data.data?.quotes?.new) {
          setNewQuotesCount(res.data.data.quotes.new);
        }
      } catch (e) {
        // ignore
      }
    }
    loadBadge();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Bảng thống kê', icon: LayoutDashboard, end: true },
    { to: '/admin/quotes', label: 'Yêu cầu báo giá', icon: MessageSquare, badge: newQuotesCount },
    { to: '/admin/products', label: 'Quản lý sản phẩm', icon: ShoppingBag },
    { to: '/admin/categories', label: 'Quản lý danh mục', icon: FolderKanban },
    { to: '/admin/services', label: 'Quản lý dịch vụ', icon: Wrench },
    { to: '/admin/projects', label: 'Quản lý công trình', icon: Building2 },
    { to: '/admin/articles', label: 'Tin tức & Bài viết', icon: FileText },
    { to: '/admin/reviews', label: 'Đánh giá khách hàng', icon: Star },
    { to: '/admin/settings', label: 'Cấu hình website', icon: Settings },
    { to: '/admin/profile', label: 'Tài khoản & Mật khẩu', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-base text-amber-400">Admin Huy Hoàng</span>
        </div>
        <Link
          to="/"
          target="_blank"
          className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1"
        >
          <span>Xem web</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm">
                HH
              </div>
              <div>
                <span className="font-bold text-sm block text-white">Quản Trị Website</span>
                <span className="text-[10px] text-amber-400 font-semibold block">Nhôm Kính Huy Hoàng</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="truncate">
              <p className="font-bold text-white truncate">{admin?.full_name || admin?.username || 'Quản trị viên'}</p>
              <p className="text-[10px] text-slate-500">Quyền: {admin?.role || 'admin'}</p>
            </div>
            <Link
              to="/"
              target="_blank"
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg"
              title="Mở website trong tab mới"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 bg-slate-800 hover:bg-rose-600/20 hover:text-rose-400 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
