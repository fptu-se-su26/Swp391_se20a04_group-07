import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import toast from 'react-hot-toast';

export default function ForgotPage() {
  const navigate = useNavigate();
  const [step, setStep]     = useState(1);
  const [email, setEmail]   = useState('');
  const [otp, setOtp]       = useState('');
  const [newPw, setNewPw]   = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      toast.success('OTP đã được gửi đến email của bạn');
      setStep(2);
    } catch {} finally { setLoading(false); }
  };

  const resetPw = async (e) => {
    e.preventDefault();
    if (newPw.length < 6) return toast.error('Mật khẩu phải ít nhất 6 ký tự');
    setLoading(true);
    try {
      await authApi.resetPassword({ email, code: otp, new_password: newPw });
      toast.success('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-xl font-bold text-gray-800">Quên mật khẩu</h1>
        </div>

        {step === 1 ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email đã đăng ký</label>
              <input type="email" className="input" placeholder="email@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
            <p className="text-center text-sm"><Link to="/login" className="text-primary-600 hover:underline">← Quay lại đăng nhập</Link></p>
          </form>
        ) : (
          <form onSubmit={resetPw} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">OTP đã gửi đến <strong>{email}</strong></p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã OTP</label>
              <input className="input text-center text-2xl tracking-widest" maxLength={6}
                value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <input type="password" className="input" placeholder="Tối thiểu 6 ký tự"
                value={newPw} onChange={e => setNewPw(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
