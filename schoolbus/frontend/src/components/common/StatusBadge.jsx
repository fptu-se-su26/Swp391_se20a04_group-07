import React from 'react';

// ============================================================
// BADGE STATUS
// ============================================================
export function StatusBadge({ status }) {
  const map = {
    active:       ['badge-green',  'Hoạt động'],
    inactive:     ['badge-gray',   'Không hoạt động'],
    maintenance:  ['badge-yellow', 'Bảo trì'],
    pending:      ['badge-yellow', 'Chờ xử lý'],
    in_progress:  ['badge-blue',   'Đang chạy'],
    completed:    ['badge-green',  'Hoàn thành'],
    cancelled:    ['badge-red',    'Đã hủy'],
    paid:         ['badge-green',  'Đã thanh toán'],
    overdue:      ['badge-red',    'Quá hạn'],
    open:         ['badge-red',    'Chưa giải quyết'],
    resolved:     ['badge-green',  'Đã giải quyết'],
    boarded:      ['badge-green',  'Đã lên xe'],
    absent:       ['badge-red',    'Vắng mặt'],
    waiting:      ['badge-yellow', 'Chờ đón'],
    dropped_off:  ['badge-blue',   'Đã xuống xe'],
    approved:     ['badge-green',  'Đã duyệt'],
    rejected:     ['badge-red',    'Từ chối'],
  };
  const [cls, label] = map[status] || ['badge-gray', status];
  return <span className={cls}>{label}</span>;
}

// ============================================================
// PRIORITY BADGE — 🔵 Normal / 🟡 Important / 🔴 Urgent
// ============================================================
export function PriorityBadge({ priority }) {
  const map = {
    normal:    { cls: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500',   label: 'Bình thường' },
    important: { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', label: 'Quan trọng'  },
    urgent:    { cls: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500',    label: 'Khẩn cấp'   },
  };
  const p = map[priority] || map.normal;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${p.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
      {p.label}
    </span>
  );
}

// ============================================================
// TARGET ROLE BADGE
// ============================================================
const TARGET_ROLE_LABEL = {
  driver:  '🚐 Tài xế',
  student: '🎒 Học sinh',
  parent:  '👨‍👩‍👧 Phụ huynh',
  all:     '📢 Tất cả',
};

export function TargetRoleBadge({ targetRole }) {
  return <span className="badge-gray">{TARGET_ROLE_LABEL[targetRole] || targetRole}</span>;
}
