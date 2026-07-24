import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = '856732490349-vpcvp2dolapdlnh5tejgp193u4smda7p.apps.googleusercontent.com';

const loadGoogleScript = () => new Promise((resolve) => {
  if (window.google) return resolve();
  const s = document.createElement('script');
  s.src = 'https://accounts.google.com/gsi/client';
  s.async = true; s.onload = resolve;
  document.head.appendChild(s);
});

/* ─────────────────────────────────────────────
   Bus SVG icon (khớp màu logo web)
───────────────────────────────────────────── */
const BusIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="14" width="52" height="32" rx="7" fill="#FBBF24"/>
    <rect x="6" y="22" width="52" height="16" fill="#FDE68A"/>
    <rect x="10" y="26" width="10" height="8" rx="2" fill="#60A5FA"/>
    <rect x="24" y="26" width="10" height="8" rx="2" fill="#60A5FA"/>
    <rect x="38" y="26" width="10" height="8" rx="2" fill="#60A5FA"/>
    <rect x="6" y="22" width="52" height="3" fill="#F59E0B"/>
    <rect x="6" y="38" width="52" height="3" fill="#F59E0B"/>
    <rect x="28" y="14" width="4" height="8" fill="#F59E0B"/>
    <circle cx="18" cy="50" r="5" fill="#1E293B"/>
    <circle cx="18" cy="50" r="2.5" fill="#94A3B8"/>
    <circle cx="46" cy="50" r="5" fill="#1E293B"/>
    <circle cx="46" cy="50" r="2.5" fill="#94A3B8"/>
    <rect x="6" y="14" width="6" height="16" rx="2" fill="#F59E0B"/>
    <rect x="52" y="14" width="6" height="16" rx="2" fill="#F59E0B"/>
    <rect x="4" y="30" width="4" height="8" rx="2" fill="#EF4444"/>
    <rect x="56" y="30" width="4" height="8" rx="2" fill="#F97316"/>
  </svg>
);

/* ─────────────────────────────────────────────
   Main LoginPage
───────────────────────────────────────────── */
export default function LoginPage() {
  const { login, loginGoogle, user } = useAuth();
  const navigate = useNavigate();

  // view: 'select' | 'admin-pick' | 'staff-login' | 'family-pick' | 'forgot'
  const [view,      setView]      = useState('select');
  const [staffRole, setStaffRole] = useState('admin');
  const [form,      setForm]      = useState({ email: '', password: '' });
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    if (user) {
      const map = { admin: '/admin', manager: '/manager', driver: '/driver', parent: '/parent', student: '/student' };
      navigate(map[user.role] || '/', { replace: true });
    }
  }, [user]);

  useEffect(() => { loadGoogleScript().then(() => setGoogleReady(true)); }, []);

  const handleGoogleLogin = () => {
    if (!googleReady || !window.google) return toast.error('Google chưa sẵn sàng, thử lại');
    setLoading(true);
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        try {
          const u = await loginGoogle(credential);
          const map = { parent: '/parent', student: '/student' };
          navigate(map[u.role] || '/', { replace: true });
        } catch {} finally { setLoading(false); }
      },
      auto_select: false,
    });
    window.google.accounts.id.prompt((n) => {
      if (n.isNotDisplayed() || n.isSkippedMoment()) setLoading(false);
    });
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Nhập đầy đủ email và mật khẩu');
    setLoading(true);
    try {
      const u = await login(form.email, form.password, staffRole);
      const map = { admin: '/admin', manager: '/manager', driver: '/driver' };
      navigate(map[u.role], { replace: true });
    } catch (error) {
      console.error('Login Error:', error);
      // Toast đã được hiện bởi axios interceptor, không cần hiện lại ở đây
    } finally { setLoading(false); }
  };

  const openStaffLogin = (role) => {
    setStaffRole(role);
    setForm({ email: '', password: '' });
    setShowPw(false);
    setView('staff-login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #1a3fa8 0%, #2563eb 55%, #60a5fa 100%)' }}>

      {/* ── Brand header ── */}
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl"
            style={{ background: 'rgba(255,255,255,0.18)' }}>
            🚌
          </div>
          <div className="text-white font-bold text-2xl tracking-tight">SchoolBus</div>
          <div className="text-blue-200 text-sm mt-1">Hệ thống quản lý xe đưa đón học sinh</div>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-7">

            {/* ══════════════ ROLE SELECT ══════════════ */}
            {view === 'select' && (
              <>
                <p className="text-center text-sm font-medium text-gray-700 mb-5">Chọn vai trò của bạn</p>

                {/* Quản trị viên */}
                <RoleButton
                  onClick={() => setView('admin-pick')}
                  iconBg="#EDE9FE"
                  icon={<span className="text-xl">🛡️</span>}
                  label="Quản trị viên"
                  desc="Admin & Manager hệ thống"
                  arrowColor="#a78bfa"
                  bg="#f5f3ff"
                  hoverBg="#ede9fe"
                />

                {/* Phụ huynh & Học sinh */}
                <RoleButton
                  onClick={() => setView('family-pick')}
                  iconBg="#D1FAE5"
                  icon={<span className="text-xl">👨‍👩‍👧</span>}
                  label="Phụ huynh & Học sinh"
                  desc="Theo dõi con & xin nghỉ"
                  arrowColor="#6ee7b7"
                  bg="#f0fdf4"
                  hoverBg="#dcfce7"
                />

                {/* Tài xế */}
                <RoleButton
                  onClick={() => openStaffLogin('driver')}
                  iconBg="#FEF3C7"
                  icon={<BusIcon size={26} />}
                  label="Tài xế"
                  desc="Lộ trình, điểm danh, GPS"
                  arrowColor="#fcd34d"
                  bg="#fffbeb"
                  hoverBg="#fef3c7"
                />

                <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2 items-start">
                  <span className="text-blue-400 text-xs mt-0.5">ℹ️</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Phụ huynh & học sinh đăng nhập bằng Google. Admin, Manager & Tài xế dùng tài khoản do hệ thống cấp.
                  </p>
                </div>
              </>
            )}

            {/* ══════════════ ADMIN PICK ══════════════ */}
            {view === 'admin-pick' && (
              <>
                <BackButton onClick={() => setView('select')} />
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Chọn vai trò quản trị</p>
                    <p className="text-xs text-gray-400">Đăng nhập bằng tài khoản hệ thống</p>
                  </div>
                </div>

                <PickOption
                  icon="👤"
                  label="Admin"
                  desc="Quản lý toàn bộ hệ thống"
                  onClick={() => openStaffLogin('admin')}
                />
                <PickOption
                  icon="👔"
                  label="Manager"
                  desc="Quản lý tuyến xe & nhân sự"
                  onClick={() => openStaffLogin('manager')}
                />
              </>
            )}

            {/* ══════════════ FAMILY PICK ══════════════ */}
            {view === 'family-pick' && (
              <>
                <BackButton onClick={() => setView('select')} />
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-2xl">👨‍👩‍👧</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Phụ huynh & Học sinh</p>
                    <p className="text-xs text-gray-400">Đăng nhập bằng tài khoản Google</p>
                  </div>
                </div>

                <PickOption
                  icon="👪"
                  label="Phụ huynh"
                  desc="Theo dõi con & xin nghỉ"
                  onClick={handleGoogleLogin}
                />
                <PickOption
                  icon="🎒"
                  label="Học sinh"
                  desc="Xem lộ trình & thông báo"
                  onClick={handleGoogleLogin}
                />

                {/* Google button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 mt-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-700 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                  )}
                  {loading ? 'Đang xác thực...' : 'Đăng nhập với Google'}
                </button>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs text-amber-700 text-center leading-relaxed">
                    🔒 Chỉ tài khoản Google đã được nhà trường đăng ký mới có thể đăng nhập.
                  </p>
                </div>
              </>
            )}

            {/* ══════════════ STAFF LOGIN FORM ══════════════ */}
            {view === 'staff-login' && (
              <>
                <BackButton onClick={() => setView(staffRole === 'driver' ? 'select' : 'admin-pick')} />

                <div className="flex items-center gap-2 mb-5">
                  <span className="text-2xl">
                    {staffRole === 'admin' ? '👤' : staffRole === 'manager' ? '👔' : <BusIcon size={28} />}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      Đăng nhập {staffRole === 'admin' ? 'Admin' : staffRole === 'manager' ? 'Manager' : 'Tài xế'}
                    </p>
                    <p className="text-xs text-gray-400">Nhập thông tin tài khoản hệ thống</p>
                  </div>
                </div>

                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400 text-sm">✉️</span>
                      <input
                        type="email"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        placeholder="email@schoolbus.vn"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Mật khẩu</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400 text-sm">🔒</span>
                      <input
                        type={showPw ? 'text' : 'password'}
                        className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        required
                      />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-sm">
                        {showPw ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={() => setView('forgot')}
                      className="text-xs text-blue-600 hover:underline">
                      Quên mật khẩu?
                    </button>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all shadow-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-[0.98]">
                    {loading
                      ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Đang đăng nhập...
                        </span>
                      : `Đăng nhập`}
                  </button>
                </form>

                {/* Demo credentials */}

              </>
            )}

            {/* ══════════════ FORGOT PASSWORD ══════════════ */}
            {view === 'forgot' && (
              <ForgotPassword
                role={staffRole}
                onBack={() => setView('staff-login')}
              />
            )}

          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-4 opacity-70">
          © 2024 School Bus System — SWP391 FPT University
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function RoleButton({ onClick, iconBg, icon, label, desc, arrowColor, bg, hoverBg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2.5 transition-all text-left"
      style={{ background: hovered ? hoverBg : bg }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
      </div>
      <span className="text-base" style={{ color: arrowColor }}>→</span>
    </button>
  );
}

function PickOption({ icon, label, desc, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition mb-2.5 text-left">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
      <span className="text-blue-300 text-sm">→</span>
    </button>
  );
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick}
      className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 transition">
      ← Quay lại
    </button>
  );
}

/* ─────────────────────────────────────────────
   ForgotPassword (giữ nguyên logic gốc)
───────────────────────────────────────────── */
function ForgotPassword({ role, onBack }) {
  const [step,    setStep]    = useState(1);
  const [email,   setEmail]   = useState('');
  const [otp,     setOtp]     = useState('');
  const [newPw,   setNewPw]   = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const r = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const d = await r.json();
      if (d.success) { toast.success('OTP đã gửi đến email'); setStep(2); }
      else toast.error(d.message);
    } catch { toast.error('Lỗi kết nối'); } finally { setLoading(false); }
  };

  const reset = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const r = await fetch('/api/v1/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, new_password: newPw, role }),
      });
      const d = await r.json();
      if (d.success) { toast.success('Đặt lại mật khẩu thành công!'); onBack(); }
      else toast.error(d.message);
    } catch { toast.error('Lỗi kết nối'); } finally { setLoading(false); }
  };

  return (
    <div>
      <BackButton onClick={onBack} />
      <h3 className="font-semibold text-gray-800 mb-4 text-sm">🔐 Quên mật khẩu</h3>
      {step === 1 ? (
        <form onSubmit={send} className="space-y-4">
          <input type="email"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email của bạn" value={email}
            onChange={e => setEmail(e.target.value)} required />
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={reset} className="space-y-4">
          <p className="text-xs text-gray-500 text-center">OTP đã gửi đến <strong>{email}</strong></p>
          <input
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-center text-2xl tracking-widest bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="000000" maxLength={6} value={otp}
            onChange={e => setOtp(e.target.value)} required />
          <input type="password"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mật khẩu mới (ít nhất 6 ký tự)" value={newPw}
            onChange={e => setNewPw(e.target.value)} required />
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-50 transition">
            {loading ? 'Đang xử lý...' : '✅ Đặt lại mật khẩu'}
          </button>
        </form>
      )}
    </div>
  );
}
