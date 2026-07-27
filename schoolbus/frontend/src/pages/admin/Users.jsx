import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api';
import { PageHeader, Modal, StatusBadge, LoadingScreen, ConfirmDialog } from '../../components/common';
import toast from 'react-hot-toast';

// ── Chỉ 3 role dùng password login (Parent/Student quản lý ở trang Học sinh) ──
const ROLES = ['admin', 'manager', 'driver'];
const ROLE_LABELS = { admin: 'Admin', manager: 'Manager', driver: 'Tài xế' };
const ROLE_ICONS  = { admin: '👑',   manager: '📋',      driver: '🚌'    };
const ROLE_COLORS = {
  admin:   'bg-purple-100 text-purple-700',
  manager: 'bg-blue-100 text-blue-700',
  driver:  'bg-green-100 text-green-700',
};

const initForm = { full_name: '', email: '', phone: '', role: 'driver', password: '' };

export default function AdminUsers() {
  const [users,      setUsers]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);
  const [selected,   setSelected]   = useState(null);
  const [form,       setForm]       = useState(initForm);
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page,       setPage]       = useState(1);
  const [confirm,    setConfirm]    = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getUsers({ search, role: roleFilter, page, limit: 20 });
      setUsers(data.data.data);
      setTotal(data.data.total);
    } catch {} finally { setLoading(false); }
  }, [search, roleFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => { setForm(initForm); setModal('create'); };
  const openEdit   = (u) => {
    setSelected(u);
    setForm({ full_name: u.full_name, email: u.email, phone: u.phone || '', role: u.role, password: '' });
    setModal('edit');
  };

  const handleSave = async () => {
    try {
      if (modal === 'create') {
        await adminApi.createUser(form);
        toast.success('Đã tạo tài khoản');
      } else {
        await adminApi.updateUser(selected.id, form);
        toast.success('Đã cập nhật');
      }
      setModal(null);
      fetchUsers();
    } catch {}
  };

  const handleToggle = async (id, role) => {
    try {
      await adminApi.toggleActive(id, role);
      toast.success('Đã cập nhật trạng thái');
      fetchUsers();
    } catch {}
  };

  const handleDelete = async (id, role) => {
    try {
      await adminApi.deleteUser(id, role);
      toast.success('Đã xóa');
      fetchUsers();
    } catch {}
  };

  if (loading && users.length === 0) return <LoadingScreen />;

  return (
    <div>
      <PageHeader
        title="Quản lý người dùng"
        subtitle={`${total} tài khoản · Admin, Manager, Tài xế`}
        action={<button onClick={openCreate} className="btn-primary">+ Tạo tài khoản</button>}
      />

      {/* Filters */}
      <div className="card mb-4 flex flex-wrap gap-3">
        <input className="input w-64" placeholder="🔍 Tìm kiếm tên, email, SĐT..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select className="input w-40" value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="">Tất cả</option>
          {/* Chỉ hiện 3 role — KHÔNG có parent/student */}
          {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
        <button onClick={fetchUsers} className="btn-secondary">🔄 Làm mới</button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Họ tên', 'Email', 'SĐT', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Hành động'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                        {u.full_name?.charAt(0)}
                      </div>
                      {u.full_name}
                    </div>
                  </td>
                  <td className="table-cell text-gray-500">{u.email}</td>
                  <td className="table-cell text-gray-500">{u.phone || '—'}</td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                      {ROLE_ICONS[u.role]} {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={u.is_active ? 'active' : 'inactive'} />
                  </td>
                  <td className="table-cell text-gray-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u)}
                        className="text-blue-600 hover:underline text-xs">Sửa</button>
                      <button onClick={() => handleToggle(u.id, u.role)}
                        className="text-yellow-600 hover:underline text-xs">
                        {u.is_active ? 'Khóa' : 'Mở'}
                      </button>
                      <button onClick={() => setConfirm({ id: u.id, role: u.role, name: u.full_name })}
                        className="text-red-600 hover:underline text-xs">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    <div className="text-4xl mb-2">👥</div>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <p className="text-xs text-gray-500">Hiển thị {users.length} / {total}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
              className="btn-secondary text-xs py-1">← Trước</button>
            <span className="px-3 py-1 bg-white border rounded text-xs">Trang {page}</span>
            <button onClick={() => setPage(p => p+1)} disabled={users.length < 20}
              className="btn-secondary text-xs py-1">Sau →</button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal === 'create' ? '+ Tạo tài khoản nhân viên' : '✏️ Chỉnh sửa tài khoản'}>
        <div className="space-y-4">

          {/* Ghi chú trong modal */}
          {modal === 'create' && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
              ⚠️ Trang này chỉ tạo tài khoản <strong>Admin, Manager, Tài xế</strong>.
              Để thêm học sinh, vui lòng dùng trang <strong>Học sinh</strong>.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input className="input" placeholder="Nguyễn Văn A"
              value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input" placeholder="email@schoolbus.vn"
              value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input className="input" placeholder="0901234567"
              value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select className="input" value={form.role}
              onChange={e => setForm(f => ({...f, role: e.target.value}))}>
              {/* Chỉ cho chọn 3 role — KHÔNG có parent/student */}
              {ROLES.map(r => <option key={r} value={r}>{ROLE_ICONS[r]} {ROLE_LABELS[r]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {modal === 'edit' ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}
            </label>
            <input type="password" className="input"
              placeholder={modal === 'edit' ? 'Để trống nếu không thay đổi' : 'Tối thiểu 6 ký tự'}
              value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="btn-secondary flex-1">Hủy</button>
            <button onClick={handleSave} className="btn-primary flex-1">
              {modal === 'create' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={() => { handleDelete(confirm?.id, confirm?.role); setConfirm(null); }}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa tài khoản "${confirm?.name}"?`}
        danger
      />
    </div>
  );
}
