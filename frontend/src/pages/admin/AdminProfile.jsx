import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, CheckCircle2, AlertCircle, KeyRound, Shield } from 'lucide-react';

export default function AdminProfile() {
  const { admin, changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setSuccessMsg('Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(res.message || 'Mật khẩu hiện tại không chính xác.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Lỗi khi cập nhật mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Tài Khoản & Bảo Mật</h1>
        <p className="text-xs text-slate-400 mt-1">Quản lý thông tin đăng nhập và đổi mật khẩu quản trị</p>
      </div>

      {/* Account Info Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
        <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Thông Tin Tài Khoản</span>
        </h2>

        <div className="space-y-2 text-xs sm:text-sm text-slate-300">
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Tên đăng nhập:</span>
            <strong className="text-white font-mono">{admin?.username || 'admin'}</strong>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Họ và tên:</span>
            <span className="text-white">{admin?.full_name || 'Quản trị viên'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Email:</span>
            <span className="text-white">{admin?.email || 'huyhoangnhomkinh77@gmail.com'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Vai trò:</span>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold rounded text-xs">{admin?.role || 'superadmin'}</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
        <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <KeyRound className="w-4 h-4" />
          <span>Đổi Mật Khẩu Đăng Nhập</span>
        </h2>

        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Mật khẩu hiện tại *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Mật khẩu mới (tối thiểu 6 ký tự) *</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Xác nhận mật khẩu mới *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
