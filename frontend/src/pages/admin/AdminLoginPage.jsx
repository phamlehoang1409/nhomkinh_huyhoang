import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, AlertCircle, ArrowLeft, KeyRound, Zap, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, quickLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin@123');
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (isAuthenticated) {
    navigate('/admin');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    setLoading(true);
    try {
      const res = await login(username || 'admin', password || 'admin@123');
      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMsg(res.message || 'Lỗi xác thực.');
      }
    } catch (err) {
      setErrorMsg('Lỗi đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setQuickLoading(true);
    setErrorMsg('');
    try {
      const res = await quickLogin();
      if (res.success) {
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl mx-auto shadow-lg shadow-amber-500/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Đăng Nhập Quản Trị</h1>
          <p className="text-xs text-slate-400">Hệ thống quản lý nội dung Nhôm Kính Huy Hoàng</p>
        </div>

        {/* 1-Click Quick Direct Login Button */}
        <button
          type="button"
          onClick={handleQuickLogin}
          disabled={quickLoading || loading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
          <span>{quickLoading ? 'Đang vào bảng điều khiển...' : '⚡ Đăng Nhập Nhanh 1 Chạm (Vào Thẳng)'}</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase font-semibold">Hoặc nhập tài khoản</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tên đăng nhập
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin@123"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <p className="text-[11px] text-amber-400/90 mt-1 font-medium">
              (Mặc định: admin / admin@123)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || quickLoading}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-amber-400 flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
