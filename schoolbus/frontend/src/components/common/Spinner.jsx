import React from 'react';

// ============================================================
// LOADING SPINNER
// ============================================================
export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${s[size]} border-3 border-primary-600 border-t-transparent rounded-full animate-spin`} />
  );
}

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <Spinner size="lg" />
        <p className="text-sm">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}
