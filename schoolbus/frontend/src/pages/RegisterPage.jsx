// ============================================================
// REGISTER PAGE  (src/pages/RegisterPage.jsx)
// ============================================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep]   = useState(1); // 1=form, 2=OTP
  const [loading, setLoading] = useState(false);
  const [form, setForm]   = useState({ full_name:'', email:'', phone:'', password:'', confirmPw:'', role:'parent' });
  const [otp, setOtp]     = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPw) return toast.error('Mật khẩu không khớp');
    setLoading(true);
    try {
      await authApi.register({ full_name: form.full_name, email: form.email, phone: form.phone, password: form.password, role: form.role });
      toast.success('Đăng ký thành công! Kiểm tra email để lấy OTP');
      setStep(2);
    } catch {} finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.verifyOtp({ email: form.email, code: otp, type: 'email_verify' });
      toast.success('Xác minh email thành công!');
      navigate('/login');
    } catch {} finally { setLoading(false); }
  };

  const inp = 'input';
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🚌</div>
          <h1 className="text-xl font-bold text-gray-800">Tạo tài khoản</h1>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input className={inp} placeholder="Nguyễn Văn A" value={form.full_name}
                onChange={e => setForm(f => ({...f, full_name: e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className={inp} placeholder="email@example.com" value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input className={inp} placeholder="0901234567" value={form.phone}
                onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <select className={inp} value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}>
                <option value="parent">Phụ huynh</option>
                <option value="student">Học sinh</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input type="password" className={inp} placeholder="Tối thiểu 6 ký tự" value={form.password}
                onChange={e => setForm(f => ({...f, password: e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
              <input type="password" className={inp} placeholder="Nhập lại mật khẩu" value={form.confirmPw}
                onChange={e => setForm(f => ({...f, confirmPw: e.target.value}))} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Đã có tài khoản? <Link to="/login" className="text-primary-600 hover:underline">Đăng nhập</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center text-gray-600 mb-4">
              <p>Mã OTP đã gửi đến <strong>{form.email}</strong></p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nhập mã OTP (6 chữ số)</label>
              <input className={`${inp} text-center text-2xl tracking-widest`} maxLength={6}
                value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Đang xác minh...' : 'Xác minh OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ============================================================
// FORGOT PASSWORD PAGE  (export separately for lazy load)
// ============================================================
// src/pages/ForgotPage.jsx - create as separate file
