import React, { useState, useEffect } from 'react';

const APK_DOWNLOAD_URL = `${import.meta.env.VITE_API_URL || ''}/dowloads/SchoolBusSystem.apk`;
const QR_API = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=1a56db&bgcolor=ffffff&qzone=2&data=`;

/* ── Android APK steps ───────────────────────────────────────── */
const ANDROID_STEPS = [
  { icon: '⚙️', title: 'Bật cài từ nguồn khác', desc: 'Vào Cài đặt → Bảo mật → Cho phép cài đặt ứng dụng từ nguồn không xác định' },
  { icon: '📥', title: 'Tải file APK', desc: 'Nhấn nút tải xuống bên dưới hoặc quét mã QR bằng camera điện thoại' },
  { icon: '📂', title: 'Mở file vừa tải', desc: 'Vào thư mục Tải về (Downloads) và nhấn vào file SchoolBusSystem.apk' },
  { icon: '✅', title: 'Hoàn tất cài đặt', desc: 'Nhấn Cài đặt và chờ quá trình hoàn tất, sau đó mở ứng dụng' },
];

/* ── iOS PWA steps ───────────────────────────────────────────── */
const IOS_STEPS = [
  {
    icon: '🌐',
    title: 'Mở trang web bằng Safari',
    desc: 'Truy cập trang SchoolBus System bằng trình duyệt Safari trên iPhone/iPad (không dùng Chrome hay app khác)',
    visual: null,
  },
  {
    icon: null,
    title: 'Nhấn nút Chia sẻ',
    desc: 'Nhấn biểu tượng chia sẻ ở thanh công cụ phía dưới (hoặc trên) Safari',
    visual: 'share',
  },
  {
    icon: null,
    title: 'Chọn "Thêm vào MH chính"',
    desc: 'Cuộn xuống danh sách và chọn "Add to Home Screen" (Thêm vào Màn hình chính)',
    visual: 'add',
  },
  {
    icon: '✏️',
    title: 'Đặt tên và xác nhận',
    desc: 'Giữ nguyên tên "SchoolBus System" rồi nhấn "Add" (Thêm) ở góc trên bên phải',
    visual: null,
  },
  {
    icon: '🎉',
    title: 'Mở ứng dụng từ màn hình chính',
    desc: 'Biểu tượng SchoolBus sẽ xuất hiện trên màn hình chính — mở lên như app thật!',
    visual: null,
  },
];

const FEATURES = [
  { icon: '🗺️', title: 'Theo dõi xe thời gian thực', desc: 'Xem vị trí xe buýt trực tiếp trên bản đồ' },
  { icon: '🔔', title: 'Thông báo tức thì', desc: 'Nhận thông báo ngay khi có cập nhật chuyến đi' },
  { icon: '📋', title: 'Điểm danh & lộ trình', desc: 'Quản lý học sinh và xem lộ trình chi tiết' },
  { icon: '📱', title: 'Tối ưu cho di động', desc: 'Giao diện thiết kế riêng cho điện thoại' },
];

/* ── Share icon (Safari toolbar) ────────────────────────────── */
function ShareIcon() {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex-shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    </span>
  );
}

/* ── Add icon (the square + icon) ───────────────────────────── */
function AddIcon() {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 border border-gray-300 flex-shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    </span>
  );
}

/* ── Tabbed Install Guide ────────────────────────────────────── */
function InstallGuide() {
  const [tab, setTab] = useState('android');

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tab switcher */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setTab('android')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all ${
            tab === 'android'
              ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="text-lg">🤖</span>
          <span>Android</span>
          <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-bold hidden sm:inline">
            APK
          </span>
        </button>
        <button
          onClick={() => setTab('ios')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all ${
            tab === 'ios'
              ? 'bg-gray-900 text-white border-b-2 border-gray-800'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="text-lg">🍎</span>
          <span>iPhone / iPad</span>
          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-bold hidden sm:inline">
            Safari
          </span>
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {tab === 'android' && (
          <>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-base">📖</span>
              <h3 className="font-bold text-gray-900 text-base">Hướng dẫn cài đặt APK trên Android</h3>
            </div>
            <div className="space-y-4">
              {ANDROID_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-md shadow-green-200">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                      <span>{step.icon}</span> {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div>
                <p className="font-semibold text-amber-800 text-sm">Lưu ý bảo mật</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  Ứng dụng được phát triển nội bộ bởi đội ngũ SchoolBus SWP391. Chỉ tải từ đường link chính thức do nhà trường/admin cung cấp.
                </p>
              </div>
            </div>
          </>
        )}

        {tab === 'ios' && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🍎</span>
              <h3 className="font-bold text-gray-900 text-base">Thêm vào màn hình chính (iPhone / iPad)</h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              iPhone không hỗ trợ cài APK — nhưng bạn có thể thêm web app vào màn hình chính để dùng như app thật!
            </p>

            <div className="space-y-4">
              {IOS_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-md shadow-gray-300">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      {step.visual === 'share' && <ShareIcon />}
                      {step.visual === 'add' && <AddIcon />}
                      {step.icon && <span>{step.icon}</span>}
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual hint bar */}
            <div className="mt-5 rounded-2xl bg-gray-900 px-4 py-4 flex items-center gap-4">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
                  <img src="/logo.png" alt="logo" className="w-7 h-7 rounded-lg object-cover" />
                </div>
                <div className="text-white">
                  <p className="text-xs font-bold leading-tight">SchoolBus System</p>
                  <p className="text-[10px] text-white/50">schoolbus.app</p>
                </div>
              </div>
              <div className="flex-1 text-right">
                <span className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  + Thêm
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <p className="font-semibold text-blue-800 text-sm">Mẹo hay</p>
                <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                  Sau khi thêm vào màn hình chính, ứng dụng sẽ mở toàn màn hình không có thanh địa chỉ — trải nghiệm giống hệt app thật từ App Store!
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function DownloadApp() {
  const [qrSrc, setQrSrc] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const absoluteUrl = window.location.origin.replace(/:\d+$/, ':5000') + '/dowloads/SchoolBusSystem.apk';

  useEffect(() => {
    setQrSrc(`${QR_API}${encodeURIComponent(absoluteUrl)}`);
  }, [absoluteUrl]);

  const handleDownload = () => {
    setDownloading(true);
    const a = document.createElement('a');
    a.href = APK_DOWNLOAD_URL;
    a.download = 'SchoolBusSystem.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(absoluteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-blue-100 mb-4 overflow-hidden">
            <img src="/logo.png" alt="SchoolBus System" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            SchoolBus System
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Tải ứng dụng về điện thoại để theo dõi xe buýt và quản lý chuyến đi mọi lúc, mọi nơi
          </p>
          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
              Android 8.0+
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
              🍎 iPhone / iPad
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              📦 ~420 KB
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
              🆓 Miễn phí
            </span>
          </div>
        </div>

        {/* ── Main card: Download + QR ─────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Download */}
            <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-xl">📥</div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">Tải xuống trực tiếp</h2>
                  <p className="text-xs text-gray-400">Cho thiết bị Android</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200">
                  <span className="text-white text-xl">📱</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">SchoolBusSystem.apk</p>
                  <p className="text-xs text-gray-400">Android Package · ~420 KB</p>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                  v1.0
                </span>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold text-base transition-all shadow-lg shadow-blue-200 disabled:opacity-80 mb-3"
              >
                {downloading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <span className="text-xl">⬇️</span>
                    Tải xuống APK (Android)
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
                <span className="text-gray-400 text-xs flex-shrink-0">🔗</span>
                <p className="text-xs text-gray-500 truncate flex-1 font-mono">{absoluteUrl}</p>
                <button
                  onClick={handleCopy}
                  className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    copied ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {copied ? '✓ Đã chép' : 'Chép'}
                </button>
              </div>
            </div>

            {/* Right: QR Code */}
            <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-3 mb-5 self-start sm:self-center">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-xl">📷</div>
                <div className="text-left">
                  <h2 className="font-bold text-gray-900 text-base">Quét mã QR</h2>
                  <p className="text-xs text-gray-400">Dùng camera điện thoại</p>
                </div>
              </div>

              <div className="relative">
                <div className="w-52 h-52 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center overflow-hidden">
                  {qrSrc ? (
                    <img src={qrSrc} alt="QR tải app" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
              </div>

              <p className="text-xs text-gray-400 mt-4 max-w-[180px]">
                Mở camera → hướng vào mã QR → nhấn liên kết hiện ra
              </p>
            </div>
          </div>
        </div>

        {/* ── Features ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md transition-shadow">
              <span className="text-2xl mb-2 inline-block">{f.icon}</span>
              <p className="font-semibold text-gray-900 text-xs leading-snug mb-1">{f.title}</p>
              <p className="text-[11px] text-gray-400 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Tabbed install guide ───────────────────────────────── */}
        <InstallGuide />

        {/* ── Footer note ───────────────────────────────────────── */}
        <p className="text-center text-xs text-gray-400 mt-6">
          SchoolBus System · SWP391 · FPT University Da Nang · v1.0.0
        </p>
      </div>
    </div>
  );
}
