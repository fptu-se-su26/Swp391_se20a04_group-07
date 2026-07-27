import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { PageHeader } from './PageHeader';
import { LoadingScreen } from './Spinner';
import { PriorityBadge, TargetRoleBadge } from './StatusBadge';
import { ConfirmDialog } from './ConfirmDialog';

// ============================================================
// SEND NOTIFICATION CENTER — dùng chung cho Admin / Manager
// api phải có: sendNotification, getNotificationHistory, recallNotification,
//              editNotification, togglePinNotification
// ============================================================
const TARGET_OPTIONS = [
  { value: 'driver',  label: '🚐 Tài xế' },
  { value: 'student', label: '🎒 Học sinh' },
  { value: 'parent',  label: '👨‍👩‍👧 Phụ huynh' },
  { value: 'all',     label: '📢 Tất cả đối tượng' },
];

const PRIORITY_OPTIONS = [
  { value: 'normal',    label: '🔵 Bình thường' },
  { value: 'important', label: '🟡 Quan trọng' },
  { value: 'urgent',    label: '🔴 Khẩn cấp' },
];

export function SendNotificationCenter({ api }) {
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null); // batch đang sửa (null = tạo mới)
  const [form, setForm]       = useState({ title: '', body: '', targetRole: 'student', priority: 'normal' });
  const [saving, setSaving]   = useState(false);

  const [history, setHistory] = useState({ total: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [confirmRecall, setConfirmRecall] = useState(null);

  const fetchHistory = async (p = 1) => {
    setLoading(true);
    try {
      const r = await api.getNotificationHistory({ page: p, limit: 10, search: search || undefined, targetRole: targetFilter || undefined });
      setHistory(r.data.data);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchHistory(page); }, [page]);
  useEffect(() => { setPage(1); fetchHistory(1); }, [search, targetFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', body: '', targetRole: 'student', priority: 'normal' });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, body: item.body, targetRole: item.target_role, priority: item.priority });
    setModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.body.trim()) return toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung');
    setSaving(true);
    try {
      if (editing) {
        await api.editNotification(editing.batch_id, { title: form.title, body: form.body, priority: form.priority });
        toast.success('Đã cập nhật thông báo');
      } else {
        const r = await api.sendNotification(form);
        toast.success(`Đã gửi tới ${r.data.data.sent} người nhận`);
      }
      setModal(false);
      fetchHistory(1);
      setPage(1);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Có lỗi xảy ra');
    } finally { setSaving(false); }
  };

  const handleRecall = async (item) => {
    try {
      await api.recallNotification(item.batch_id);
      toast.success('Đã thu hồi thông báo');
      fetchHistory(page);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Không thể thu hồi');
    }
  };

  const handleTogglePin = async (item) => {
    try {
      await api.togglePinNotification(item.batch_id);
      fetchHistory(page);
    } catch {}
  };

  return (
    <div>
      <PageHeader title="Gửi thông báo" subtitle={`${history.total} thông báo đã gửi`}
        action={<button onClick={openCreate} className="btn-primary">+ Gửi thông báo mới</button>} />

      {/* Bộ lọc lịch sử */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input className="input flex-1 min-w-[200px]" placeholder="🔍 Tìm kiếm tiêu đề, nội dung..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input w-auto" value={targetFilter} onChange={e => setTargetFilter(e.target.value)}>
          <option value="">Tất cả đối tượng</option>
          {TARGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? <LoadingScreen /> : (
        <>
          <div className="space-y-3">
            {history.data.map(item => {
              const canManage = item.read_count === 0 && !item.recalled_at;
              return (
                <div key={item.batch_id} className={`card ${item.pinned ? 'border-amber-300 bg-amber-50/30' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {item.pinned ? <span title="Đã ghim">📌</span> : null}
                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                        <PriorityBadge priority={item.priority} />
                        <TargetRoleBadge targetRole={item.target_role} />
                        {item.recalled_at && <span className="badge-red">Đã thu hồi</span>}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.body}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Gửi bởi {item.sender_name} · {dayjs(item.sent_at).format('DD/MM/YYYY HH:mm')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-700">{item.read_count}/{item.total_recipients}</p>
                      <p className="text-xs text-gray-400">đã đọc</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <button onClick={() => handleTogglePin(item)} className="btn-secondary text-xs">
                      {item.pinned ? '📌 Bỏ ghim' : '📌 Ghim'}
                    </button>
                    {canManage && (
                      <>
                        <button onClick={() => openEdit(item)} className="btn-secondary text-xs">✏️ Sửa</button>
                        <button onClick={() => setConfirmRecall(item)}
                          className="text-red-600 hover:bg-red-50 border border-red-200 rounded-lg px-3 py-1 text-xs font-medium transition">
                          ↩️ Thu hồi
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {history.data.length === 0 && (
              <div className="card text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">📨</p>
                <p>Chưa gửi thông báo nào</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary">← Trước</button>
            <span className="flex items-center text-sm text-gray-600 px-3">Trang {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={history.data.length < 10} className="btn-secondary">Sau →</button>
          </div>
        </>
      )}

      {/* Modal Gửi / Sửa */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? '✏️ Chỉnh sửa thông báo' : '+ Gửi thông báo mới'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
            <input className="input" placeholder="VD: Thông báo nghỉ lễ"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung <span className="text-red-500">*</span></label>
            <textarea className="input" rows={4} placeholder="Nội dung chi tiết..."
              value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
          </div>

          {!editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đối tượng nhận</label>
              <div className="grid grid-cols-2 gap-2">
                {TARGET_OPTIONS.map(o => (
                  <button key={o.value} type="button" onClick={() => setForm(f => ({ ...f, targetRole: o.value }))}
                    className={`p-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left
                      ${form.targetRole === o.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Chỉ chọn được 1 nhóm cho mỗi lần gửi (hoặc "Tất cả đối tượng").</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ ưu tiên</label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITY_OPTIONS.map(o => (
                <button key={o.value} type="button" onClick={() => setForm(f => ({ ...f, priority: o.value }))}
                  className={`p-2 rounded-xl border-2 text-xs font-medium transition-all
                    ${form.priority === o.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-secondary flex-1">Hủy</button>
            <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Đang xử lý...' : editing ? 'Lưu thay đổi' : '📤 Gửi thông báo'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmRecall} onClose={() => setConfirmRecall(null)}
        onConfirm={() => handleRecall(confirmRecall)}
        title="Thu hồi thông báo"
        message={`Bạn có chắc muốn thu hồi thông báo "${confirmRecall?.title}"? Người nhận sẽ không còn thấy thông báo này nữa.`}
        danger
      />
    </div>
  );
}
