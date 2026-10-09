import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="text-8xl font-black text-amber-500/20">404</div>
      <h1 className="text-3xl font-black text-white">Trang Không Tồn Tại</h1>
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        Đường dẫn quý khách đang tìm kiếm không tồn tại hoặc đã được thay đổi trên hệ thống.
      </p>
      <div className="flex items-center justify-center gap-4 pt-4">
        <Link
          to="/"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
        >
          <Home className="w-4 h-4" />
          <span>Về Trang Chủ</span>
        </Link>
        <Link
          to="/san-pham"
          className="px-6 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold rounded-xl text-sm transition-colors"
        >
          Xem Sản Phẩm
        </Link>
      </div>
    </div>
  );
}
