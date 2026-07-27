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
   Bus SVG icon
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
   Main LoginPage Component
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
    } finally { setLoading(false); }
  };

  const openStaffLogin = (role) => {
    setStaffRole(role);
    setForm({ email: '', password: '' });
    setShowPw(false);
    setView('staff-login');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center lg:justify-between p-4 sm:p-6 lg:p-10 overflow-hidden animate-bg-flow select-none"
      style={{
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 25%, #1e1b4b 55%, #1e3a8a 80%, #ea580c 100%)',
      }}>

      {/* ── Dynamic Glowing Orbs in Background ── */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-orange-500/25 via-blue-600/20 to-indigo-600/10 blur-3xl animate-orb-1 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/25 to-indigo-700/20 blur-3xl animate-orb-2 pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-r from-orange-600/20 via-amber-500/20 to-blue-600/25 blur-3xl animate-orb-3 pointer-events-none" />

      {/* ── Subtle Geometric Grid Pattern Overlay ── */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
         LEFT SIDE: FPT UNIVERSITY DA NANG BUS & MAP SHOWCASE
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 xl:w-7/12 h-full min-h-[660px] pr-8 xl:pr-12 z-10 text-white">
        
        {/* Top Header Logo & FPT University Badge */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-xl shadow-orange-950/40 border border-white/40 flex items-center justify-center hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="SchoolBus Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-orange-300">
                SchoolBus
              </span>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/30 text-orange-300 border border-orange-400/40 tracking-wider">
                FPT UNIVERSITY DÀ NẴNG
              </span>
            </div>
            <p className="text-xs text-blue-200/90 font-medium tracking-wide mt-0.5">
              Hệ thống quản lý xe đưa đón thông minh — FPT City Đà Nẵng
            </p>
          </div>
        </div>

        {/* Center Interactive Visual Showcase Card */}
        <div className="my-auto relative py-4">
          
          {/* Main Map Background Illustration Container */}
          <div className="relative rounded-3xl overflow-hidden border border-white/25 shadow-2xl shadow-slate-950/70 dark-glass-widget p-2 group">
            <img 
              src="/map_bg.png" 
              alt="Bản đồ lộ trình xe bus Đại học FPT Đà Nẵng" 
              className="w-full h-80 xl:h-96 object-cover rounded-2xl opacity-95 group-hover:scale-105 transition-transform duration-700"
            />

            {/* Glowing Map Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent rounded-2xl pointer-events-none" />

            {/* Top Left HUD: Live GPS Badge */}
            <div className="absolute top-5 left-5 dark-glass-widget px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/20 shadow-xl backdrop-blur-xl animate-float-stats">
              <span className="relative flex h-3.5 w-3.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <p className="text-xs font-black text-white">Định vị GPS Real-Time</p>
            </div>

            {/* Bottom Right HUD: Safety Certification */}
            <div className="absolute bottom-5 right-5 dark-glass-widget px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/20 shadow-xl backdrop-blur-xl">
              <div className="w-8 h-8 rounded-xl bg-blue-500/25 border border-blue-400/40 flex items-center justify-center text-base flex-shrink-0">
                🛡️
              </div>
              <div>
                <p className="text-xs font-bold text-white">An toàn 100%</p>
              </div>
            </div>
          </div>
        </div>


        {/* Footer Credit */}
        <div className="text-xs text-blue-200/70 font-medium flex items-center justify-between">
          <span>© Team_7 School Bus System — SWP391 FPT University</span>
          <span className="text-orange-300/80 font-bold">FPTU Da Nang Campus</span>
        </div>
      </div>


      {/* ─────────────────────────────────────────────────────────────
         RIGHT SIDE: RIGHT-ALIGNED GLASSMORPHISM LOGIN CARD
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full lg:w-[460px] xl:w-[490px] flex justify-center lg:justify-end">
        
        <div className="w-full glass-card-login rounded-3xl shadow-2xl shadow-slate-950/60 overflow-hidden border border-white/70 transition-all duration-300">
          
          {/* Subtle Top Gradient Accent Bar with FPT Orange */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-blue-600 to-indigo-600" />

          <div className="px-6 py-6 sm:px-8 sm:py-7">

            {/* ── Brand Header (Top Card Logo) ── */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-3 p-1.5 bg-white rounded-3xl shadow-xl shadow-orange-950/20 border border-gray-100 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <img src="/logo.png" alt="SchoolBus Logo" className="w-full h-full object-contain" />
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-bold mb-2">
                <span>🍊</span> ĐẠI HỌC FPT ĐÀ NẴNG
              </div>

              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                School<span className="text-amber-500">Bus</span> <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 align-middle">SYSTEM</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                KẾT NỐI AN TOÀN – ĐỒNG HÀNH TIN CẬY
              </p>
            </div>

            {/* ══════════════ ROLE SELECT ══════════════ */}
            {view === 'select' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="text-center mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vui lòng chọn vai trò để đăng nhập</p>
                </div>

                {/* Quản trị viên */}
                <RoleButton
                  onClick={() => setView('admin-pick')}
                  iconBg="linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)"
                  icon={<span className="text-xl">🛡️</span>}
                  label="Quản trị hệ thống"
                  desc="Dành cho Admin & Manager FPTU"
                  badgeText="Hệ thống"
                  badgeColor="bg-purple-100 text-purple-700"
                  accentBorder="hover:border-purple-300"
                  bg="bg-purple-50/50"
                  hoverBg="bg-purple-100/80"
                />

                {/* Phụ huynh & Học sinh */}
                <RoleButton
                  onClick={() => setView('family-pick')}
                  iconBg="linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
                  icon={<span className="text-xl">👨‍👩‍👧</span>}
                  label="Phụ huynh & Học sinh"
                  desc="Theo dõi xe FPTU, điểm danh & nghỉ học"
                  badgeText="Google FPT"
                  badgeColor="bg-emerald-100 text-emerald-700"
                  accentBorder="hover:border-emerald-300"
                  bg="bg-emerald-50/50"
                  hoverBg="bg-emerald-100/80"
                />

                {/* Tài xế */}
                <RoleButton
                  onClick={() => openStaffLogin('driver')}
                  iconBg="linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                  icon={<BusIcon size={26} />}
                  label="Tài xế xe bus FPTU"
                  desc="Lộ trình FPT City, điểm danh & GPS"
                  badgeText="Tài khoản"
                  badgeColor="bg-amber-100 text-amber-800"
                  accentBorder="hover:border-amber-300"
                  bg="bg-amber-50/50"
                  hoverBg="bg-amber-100/80"
                />

                <div className="mt-4 pt-3.5 border-t border-gray-100 flex gap-2.5 items-center bg-orange-50/70 p-3 rounded-2xl border border-orange-100">
                  <span className="text-orange-600 text-sm flex-shrink-0">💡</span>
                  <p className="text-xs text-orange-950 leading-relaxed font-medium">
                    Phụ huynh & Học sinh sử dụng tài khoản Google <strong>@fe.edu.vn / @fpt.edu.vn</strong> để truy cập.
                  </p>
                </div>
              </div>
            )}

            {/* ══════════════ ADMIN PICK ══════════════ */}
            {view === 'admin-pick' && (
              <div className="animate-fadeIn">
                <BackButton onClick={() => setView('select')} />
                
                <div className="flex items-center gap-3 mb-5 p-3 bg-purple-50/80 rounded-2xl border border-purple-100">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">
                    🛡️
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Chọn vai trò quản trị</h3>
                    <p className="text-xs text-gray-500">Đăng nhập bằng tài khoản nội bộ FPTU</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <PickOption
                    icon="👤"
                    label="Admin (Quản trị viên)"
                    desc="Quản lý toàn bộ hệ thống & phân quyền"
                    accentColor="border-purple-200 hover:bg-purple-50/80"
                    onClick={() => openStaffLogin('admin')}
                  />
                  <PickOption
                    icon="👔"
                    label="Manager (Quản lý tuyến)"
                    desc="Điều hành tuyến xe, lịch trình FPT City & nhân sự"
                    accentColor="border-blue-200 hover:bg-blue-50/80"
                    onClick={() => openStaffLogin('manager')}
                  />
                </div>
              </div>
            )}

            {/* ══════════════ FAMILY PICK ══════════════ */}
            {view === 'family-pick' && (
              <div className="animate-fadeIn">
                <BackButton onClick={() => setView('select')} />

                <div className="flex items-center gap-3 mb-5 p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">
                    👨‍👩‍👧
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Phụ huynh & Học sinh FPTU</h3>
                    <p className="text-xs text-gray-500">Xác thực nhanh qua Google Workspace FPT Education</p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <PickOption
                    icon="👪"
                    label="Cổng Phụ huynh"
                    desc="Theo dõi vị trí xe, lịch đón & xin nghỉ"
                    accentColor="border-emerald-200 hover:bg-emerald-50/80"
                    onClick={handleGoogleLogin}
                  />
                  <PickOption
                    icon="🎒"
                    label="Cổng Học sinh / Sinh viên"
                    desc="Xem thời gian xe đến & điểm dừng đón FPTU"
                    accentColor="border-teal-200 hover:bg-teal-50/80"
                    onClick={handleGoogleLogin}
                  />
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50/90 active:scale-[0.98] transition-all shadow-sm text-sm font-semibold text-gray-700 disabled:opacity-60 group"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                  )}
                  <span>{loading ? 'Đang xác thực Google...' : 'Đăng nhập với Google FPT'}</span>
                </button>

                <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl">
                  <p className="text-xs text-amber-800 text-center leading-relaxed font-medium">
                    🔒 Lưu ý: Chỉ tài khoản Google FPT Education đã được đăng ký trước mới có thể truy cập.
                  </p>
                </div>
              </div>
            )}

            {/* ══════════════ STAFF LOGIN FORM ══════════════ */}
            {view === 'staff-login' && (
              <div className="animate-fadeIn">
                <BackButton onClick={() => setView(staffRole === 'driver' ? 'select' : 'admin-pick')} />

                <div className="flex items-center gap-3 mb-5 p-3 bg-blue-50/80 rounded-2xl border border-blue-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">
                    {staffRole === 'admin' ? '👤' : staffRole === 'manager' ? '👔' : <BusIcon size={26} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      Đăng nhập {staffRole === 'admin' ? 'Quản trị viên (Admin)' : staffRole === 'manager' ? 'Quản lý (Manager)' : 'Tài xế xe bus'}
                    </h3>
                    <p className="text-xs text-gray-500">Nhập email và mật khẩu tài khoản hệ thống</p>
                  </div>
                </div>

                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email tài khoản</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-gray-400 text-sm">✉️</span>
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 focus:bg-white transition-all"
                        placeholder="email@schoolbus.vn"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔒</span>
                      <input
                        type={showPw ? 'text' : 'password'}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 focus:bg-white transition-all"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(v => !v)}
                        className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 text-sm transition"
                      >
                        {showPw ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline transition"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl font-bold text-white text-sm transition-all shadow-lg shadow-orange-600/30 bg-gradient-to-r from-orange-600 via-amber-600 to-blue-600 hover:from-orange-500 hover:to-blue-500 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang xác thực...
                      </span>
                    ) : (
                      'Đăng nhập'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ══════════════ FORGOT PASSWORD ══════════════ */}
            {view === 'forgot' && (
              <div className="animate-fadeIn">
                <ForgotPassword
                  role={staffRole}
                  onBack={() => setView('staff-login')}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function RoleButton({ onClick, iconBg, icon, label, desc, badgeText, badgeColor, bg, hoverBg, accentBorder }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-200 border border-gray-100 ${accentBorder} ${bg} hover:${hoverBg} hover:shadow-md active:scale-[0.99] text-left group`}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-800 group-hover:text-blue-900 transition-colors">
            {label}
          </span>
          {badgeText && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {badgeText}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5 truncate">{desc}</div>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-white group-hover:translate-x-0.5 transition-all shadow-sm">
        →
      </div>
    </button>
  );
}

function PickOption({ icon, label, desc, onClick, accentColor = 'border-gray-200' }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border ${accentColor} bg-white hover:shadow-md transition-all duration-200 active:scale-[0.99] text-left group`}
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          {label}
        </div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
      <span className="text-blue-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all text-sm font-bold">
        →
      </span>
    </button>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-semibold text-gray-500 hover:text-orange-600 mb-4 flex items-center gap-1.5 transition-colors group"
    >
      <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Quay lại
    </button>
  );
}

/* ─────────────────────────────────────────────
   ForgotPassword component
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
      if (d.success) { toast.success('Mã OTP đã được gửi đến email!'); setStep(2); }
      else toast.error(d.message);
    } catch { toast.error('Lỗi kết nối máy chủ'); } finally { setLoading(false); }
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
    } catch { toast.error('Lỗi kết nối máy chủ'); } finally { setLoading(false); }
  };

  return (
    <div>
      <BackButton onClick={onBack} />
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🔐</span>
        <h3 className="font-bold text-gray-800 text-sm">Quên mật khẩu</h3>
      </div>

      {step === 1 ? (
        <form onSubmit={send} className="space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Nhập email tài khoản FPTU của bạn để nhận mã xác minh OTP gửi qua email.
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email tài khoản</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              placeholder="vividu@fe.edu.vn"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-bold text-sm hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
          >
            {loading ? 'Đang gửi mã OTP...' : 'Gửi mã OTP qua Email'}
          </button>
        </form>
      ) : (
        <form onSubmit={reset} className="space-y-4">
          <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-center">
            <p className="text-xs text-orange-950">
              Mã OTP 6 chữ số đã được gửi tới <strong>{email}</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-center">Mã xác thực OTP</label>
            <input
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-center text-2xl font-mono tracking-widest bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mật khẩu mới</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
              placeholder="Ít nhất 6 ký tự"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-sm hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
          >
            {loading ? 'Đang xử lý...' : '✅ Đặt lại mật khẩu'}
          </button>
        </form>
      )}
    </div>
  );
}
