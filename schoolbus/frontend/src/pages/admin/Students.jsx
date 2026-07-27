import React, { useEffect, useState, useCallback, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

// ── API helpers ───────────────────────────────────────────────
const studentApi = {
  getAll:      (params) => api.get('/students', { params }),
  getById:     (id)     => api.get(`/students/${id}`),
  create:      (data)   => api.post('/students', data),
  update:      (id, d)  => api.put(`/students/${id}`, d),
  updateStatus:(id, s)  => api.patch(`/students/${id}/status`, { status: s }),
  delete:      (id)     => api.delete(`/students/${id}`),
  importExcel: (form)   => api.post('/students/import', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getClasses:  ()       => api.get('/students/classes'),
  getRoutes:   ()       => api.get('/admin/routes'),
  getTemplate: ()       => api.get('/students/template', { responseType: 'blob' }),
};

const STATUS_COLORS = {
  active:      'bg-green-100 text-green-800',
  inactive:    'bg-gray-100 text-gray-600',
  graduated:   'bg-blue-100 text-blue-800',
  transferred: 'bg-yellow-100 text-yellow-800',
};
const STATUS_LABELS = {
  active:'Đang học', inactive:'Ngừng học', graduated:'Đã tốt nghiệp', transferred:'Chuyển trường'
};

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════
export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [filterClass, setFilterClass]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRoute, setFilterRoute]   = useState('');

  const [classes, setClasses] = useState([]);
  const [routes,  setRoutes]  = useState([]);

  // Modal states
  const [modal, setModal]       = useState(null); // 'add' | 'edit' | 'import' | 'detail'
  const [selected, setSelected] = useState(null);

  // ── Fetch data ─────────────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await studentApi.getAll({
        page, limit: 15, search,
        classId: filterClass, status: filterStatus, routeId: filterRoute,
      });
      setStudents(data.data.data);
      setTotal(data.data.total);
    } catch {} finally { setLoading(false); }
  }, [page, search, filterClass, filterStatus, filterRoute]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  useEffect(() => {
    studentApi.getClasses().then(r => setClasses(r.data.data)).catch(() => {});
    studentApi.getRoutes().then(r => setRoutes(r.data.data)).catch(() => {});
  }, []);

  // ── Handlers ───────────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa học sinh "${name}"?`)) return;
    try { await studentApi.delete(id); toast.success('Đã xóa'); fetchStudents(); } catch {}
  };

  const handleStatusChange = async (id, status) => {
    try { await studentApi.updateStatus(id, status); toast.success('Đã cập nhật trạng thái'); fetchStudents(); } catch {}
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await studentApi.getTemplate();
      const url = URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement('a');
      a.href = url; a.download = 'student_import_template.xlsx'; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Không thể tải bản mẫu'); }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý học sinh</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} học sinh trong hệ thống</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownloadTemplate} className="btn-secondary text-sm flex items-center gap-1">
            📥 Tải bản mẫu Excel
          </button>
          <button onClick={() => setModal('import')} className="btn-secondary text-sm flex items-center gap-1">
            📂 Nhập Excel
          </button>
          <button onClick={() => { setSelected(null); setModal('add'); }} className="btn-primary flex items-center gap-1">
            + Thêm học sinh
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="card mb-4 flex flex-wrap gap-3">
        <input className="input w-64" placeholder="🔍 Tìm tên, mã HS, email..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select className="input w-40" value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }}>
          <option value="">Tất cả lớp</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
        </select>
        <select className="input w-40" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="input w-44" value={filterRoute} onChange={e => { setFilterRoute(e.target.value); setPage(1); }}>
          <option value="">Tất cả tuyến xe</option>
          {routes.map(r => <option key={r.id} value={r.id}>{r.route_code} - {r.route_name}</option>)}
        </select>
        <button onClick={fetchStudents} className="btn-secondary">🔄</button>
      </div>

      {/* ── Table ── */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Mã HS','Họ tên & Lớp','Email HS','SĐT','Ngày sinh','Phụ huynh','Gmail PH','Tuyến xe','Role','Trạng thái','Ngày tạo','Thao tác'].map(h => (
                  <th key={h} className="table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={12} className="text-center py-12 text-gray-400">Đang tải...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">🎒</div>Không có học sinh nào
                </td></tr>
              ) : students.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 border-b border-gray-50">
                  <td className="table-cell font-mono font-semibold text-primary-700">{s.student_id}</td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{s.full_name}</div>
                    <div className="text-xs text-gray-400">{s.classInfo?.class_name || '—'} · {s.gender}</div>
                  </td>
                  <td className="table-cell text-gray-600 text-xs">{s.student_email}</td>
                  <td className="table-cell text-gray-500">{s.student_phone || '—'}</td>
                  <td className="table-cell text-gray-500 whitespace-nowrap">
                    {s.dob ? dayjs(s.dob).format('DD/MM/YYYY') : '—'}
                  </td>
                  <td className="table-cell">
                    <div className="text-gray-700">{s.parent_name}</div>
                  </td>
                  <td className="table-cell text-xs text-gray-500">{s.parent_gmail}</td>
                  <td className="table-cell text-xs">
                    {s.busRoute ? (
                      <span className="badge-blue">{s.busRoute.route_code}</span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="table-cell">
                    <span className="badge-blue">🎒 Student</span>
                  </td>
                  <td className="table-cell">
                    <select value={s.status}
                      onChange={e => handleStatusChange(s.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${STATUS_COLORS[s.status]}`}>
                      {Object.entries(STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                  <td className="table-cell text-xs text-gray-400 whitespace-nowrap">
                    {dayjs(s.created_at).format('DD/MM/YYYY')}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelected(s); setModal('edit'); }}
                        className="text-blue-600 hover:underline text-xs">Sửa</button>
                      <button onClick={() => handleDelete(s.id, s.full_name)}
                        className="text-red-500 hover:underline text-xs">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <p className="text-xs text-gray-500">Hiển thị {students.length} / {total}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn-secondary text-xs py-1">← Trước</button>
            <span className="px-3 py-1 bg-white border rounded text-xs">Trang {page}</span>
            <button onClick={() => setPage(p => p+1)} disabled={students.length < 15} className="btn-secondary text-xs py-1">Sau →</button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {(modal === 'add' || modal === 'edit') && (
        <StudentFormModal
          student={selected} classes={classes} routes={routes}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchStudents(); }}
        />
      )}
      {modal === 'import' && (
        <ImportModal onClose={() => setModal(null)} onDone={() => { setModal(null); fetchStudents(); }} />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// FORM MODAL — Thêm / Sửa học sinh
// ════════════════════════════════════════════════════════════
function StudentFormModal({ student, classes, routes, onClose, onSaved }) {
  const isEdit = !!student;
  const [form, setForm] = useState({
    student_id:    student?.student_id    || '',
    full_name:     student?.full_name     || '',
    dob:           student?.dob           || '',
    gender:        student?.gender        || 'Nam',
    class_id:      student?.class_id      || '',
    student_email: student?.student_email || '',
    student_phone: student?.student_phone || '',
    parent_name:   student?.parent_name   || '',
    parent_gmail:  student?.parent_gmail  || '',
    home_address:  student?.home_address  || '',
    bus_route_id:  student?.bus_route_id  || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.student_id.trim())    e.student_id    = 'Bắt buộc';
    if (!form.full_name.trim())     e.full_name     = 'Bắt buộc';
    if (!form.dob)                  e.dob           = 'Bắt buộc';
    if (!form.class_id)             e.class_id      = 'Bắt buộc';
    if (!form.student_email.trim()) e.student_email = 'Bắt buộc';
    if (!form.parent_name.trim())   e.parent_name   = 'Bắt buộc';
    if (!form.parent_gmail.trim())  e.parent_gmail  = 'Bắt buộc';
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.student_email && !emailReg.test(form.student_email)) e.student_email = 'Email không hợp lệ';
    if (form.parent_gmail  && !emailReg.test(form.parent_gmail))  e.parent_gmail  = 'Gmail không hợp lệ';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) await studentApi.update(student.id, form);
      else        await studentApi.create(form);
      toast.success(isEdit ? 'Đã cập nhật học sinh' : 'Thêm học sinh thành công!');
      onSaved();
    } catch {} finally { setLoading(false); }
  };

  const inp = (key, type = 'text', placeholder = '') => (
    <div>
      <input type={type} placeholder={placeholder} value={form[key]}
        onChange={e => set(key, e.target.value)}
        className={`input ${errors[key] ? 'border-red-400 bg-red-50' : ''}`} />
      {errors[key] && <p className="text-red-500 text-xs mt-0.5">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-2xl">
          <h3 className="font-bold text-white text-lg">
            {isEdit ? '✏️ Chỉnh sửa học sinh' : '+ Thêm học sinh mới'}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Hàng 1: Thông tin cơ bản */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">📋 Thông tin học sinh</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã học sinh <span className="text-red-500">*</span></label>
                {inp('student_id','text','VD: HS2024001')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                {inp('full_name','text','Nguyễn Văn A')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh <span className="text-red-500">*</span></label>
                {inp('dob','date')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính <span className="text-red-500">*</span></label>
                <select className="input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lớp <span className="text-red-500">*</span></label>
                <select className={`input ${errors.class_id ? 'border-red-400' : ''}`} value={form.class_id}
                  onChange={e => set('class_id', e.target.value)}>
                  <option value="">-- Chọn lớp --</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                </select>
                {errors.class_id && <p className="text-red-500 text-xs mt-0.5">{errors.class_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SĐT học sinh</label>
                {inp('student_phone','tel','0901234567')}
              </div>
            </div>
          </div>

          {/* Email học sinh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email học sinh <span className="text-red-500">*</span>
              <span className="text-xs text-blue-500 ml-1">(Dùng để đăng nhập Google)</span>
            </label>
            {inp('student_email','email','student@school.edu.vn')}
          </div>

          {/* Phụ huynh */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">👨‍👩‍👧 Thông tin phụ huynh</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên phụ huynh <span className="text-red-500">*</span></label>
                {inp('parent_name','text','Nguyễn Văn Bố')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gmail phụ huynh <span className="text-red-500">*</span>
                  <span className="text-xs text-blue-500 ml-1">(Dùng để đăng nhập Google)</span>
                </label>
                {inp('parent_gmail','email','phu.huynh@gmail.com')}
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhà</label>
            <input className="input" placeholder="123 Đường ABC, Q.1, TP.HCM"
              value={form.home_address} onChange={e => set('home_address', e.target.value)} />
          </div>

          {/* Xe buýt */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">🚌 Đăng ký xe buýt</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến xe</label>
              <select className="input" value={form.bus_route_id} onChange={e => set('bus_route_id', e.target.value)}>
                <option value="">-- Chưa đăng ký --</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.route_code} - {r.route_name}</option>)}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Xe sẽ đón/trả học sinh tận nhà theo địa chỉ đã nhập ở trên, không cần chọn điểm dừng.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Hủy</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? 'Đang lưu...' : isEdit ? '💾 Cập nhật' : '+ Thêm học sinh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// IMPORT EXCEL MODAL
// ════════════════════════════════════════════════════════════
function ImportModal({ onClose, onDone }) {
  const fileRef = useRef();
  const [file,     setFile]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);

  const handleImport = async () => {
    if (!file) return toast.error('Vui lòng chọn file Excel');
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const { data } = await studentApi.importExcel(formData);
      setResult(data.data);
      if (data.data.inserted > 0) toast.success(`Import ${data.data.inserted} học sinh thành công!`);
      if (data.data.failed > 0)   toast.error(`${data.data.failed} dòng có lỗi`);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-bold text-gray-800 text-lg">📂 Import học sinh từ Excel</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Upload area */}
          <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-primary-400 hover:bg-blue-50'}`}>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden"
              onChange={e => { setFile(e.target.files[0]); setResult(null); }} />
            {file ? (
              <div>
                <div className="text-4xl mb-2">✅</div>
                <p className="font-medium text-green-700">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">Click để chọn file khác</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">📊</div>
                <p className="font-medium text-gray-600">Click để chọn file Excel</p>
                <p className="text-xs text-gray-400 mt-1">Hỗ trợ .xlsx, .xls — Tối đa 10MB</p>
              </div>
            )}
          </div>

          {/* Lưu ý */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 space-y-1">
            <p className="font-semibold">⚠️ Lưu ý khi import:</p>
            <p>• File phải đúng định dạng template (tải template ở trên)</p>
            <p>• Cột bắt buộc: Mã học sinh, Họ tên, Ngày sinh, Giới tính, Lớp, Email HS, Tên PH, Gmail PH</p>
            <p>• Email học sinh và Gmail phụ huynh phải là Gmail để đăng nhập được</p>
            <p>• Các dòng lỗi sẽ bị bỏ qua, các dòng hợp lệ vẫn được import</p>
          </div>

          {/* Kết quả */}
          {result && (
            <div className="border rounded-xl overflow-hidden">
              <div className="flex gap-4 p-4 bg-gray-50 border-b">
                <div className="text-center"><p className="text-2xl font-bold text-gray-800">{result.total}</p><p className="text-xs text-gray-500">Tổng dòng</p></div>
                <div className="text-center"><p className="text-2xl font-bold text-green-600">{result.inserted}</p><p className="text-xs text-gray-500">Thành công</p></div>
                <div className="text-center"><p className="text-2xl font-bold text-red-500">{result.failed}</p><p className="text-xs text-gray-500">Lỗi</p></div>
              </div>
              {result.errors?.length > 0 && (
                <div className="max-h-52 overflow-y-auto">
                  <p className="text-xs font-semibold text-red-600 px-4 py-2 bg-red-50 border-b">Chi tiết lỗi:</p>
                  {result.errors.map((err, i) => (
                    <div key={i} className="px-4 py-2 border-b last:border-0 text-sm">
                      <p className="font-medium text-gray-700">Dòng {err.line}: <span className="text-gray-500">{err.student_id}</span></p>
                      {err.errors.map((e, j) => <p key={j} className="text-red-500 text-xs ml-3">• {e}</p>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1">
              {result?.inserted > 0 ? 'Đóng' : 'Hủy'}
            </button>
            {!result && (
              <button onClick={handleImport} disabled={loading || !file} className="btn-primary flex-1 py-3">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    Đang import...
                  </span>
                ) : '📤 Import ngay'}
              </button>
            )}
            {result && result.inserted > 0 && (
              <button onClick={onDone} className="btn-primary flex-1">✅ Xong</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
