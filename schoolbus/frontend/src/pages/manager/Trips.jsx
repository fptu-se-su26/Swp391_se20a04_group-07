import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { PageHeader, LoadingScreen, Modal, ConfirmDialog } from '../../components/common';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

// ── API helpers ───────────────────────────────────────────────
const tripApi = {
  getTrips:    (params) => api.get('/manager/trips', { params }),
  createTrip:  (data)   => api.post('/manager/trips', data),
  createDaily: (date)   => api.post('/manager/trips/daily', { date }),
  cancelTrip:  (id, r)  => api.patch(`/manager/trips/${id}/cancel`, { reason: r }),
  deleteTrip:  (id)     => api.delete(`/manager/trips/${id}`),
};

// ✅ Dùng /manager/... thay vì /admin/... để tránh 403
const getRoutes   = () => api.get('/admin/routes');          // manager có quyền đọc
const getDrivers  = () => api.get('/manager/drivers');        // endpoint mới cho manager
const getVehicles = () => api.get('/manager/vehicles');       // endpoint mới cho manager

const TRIP_TYPE_LABELS = {
  morning_pickup:    '🌅 Đón sáng',
  afternoon_dropoff: '🌇 Trả chiều',
  custom:            '📋 Tùy chỉnh',
};

// ── Format giờ an toàn ────────────────────────────────────────
// Backend có thể trả scheduled_start dạng "08:00:00" (TIME thuần)
// hoặc dạng ISO datetime "1970-01-01T08:00:00.000Z" (khi Sequelize
// serialize cột TIME thành Date object ở mốc epoch 1970-01-01).
// Hàm này lấy đúng HH:MM trong cả 2 trường hợp, không dùng new Date()
// để tránh bị lệch giờ do đổi múi giờ.
const formatTime = (val) => {
  if (!val) return '—';
  const str = String(val);
  const timePart = str.includes('T') ? str.split('T')[1] : str;
  return timePart ? timePart.slice(0, 5) : '—';
};

const initForm = {
  route_id:        '',
  vehicle_id:      '',
  driver_id:       '',
  trip_type:       'morning_pickup',
  scheduled_date:  dayjs().format('YYYY-MM-DD'),
  scheduled_start: '06:30',
};

// ── Gom trips cùng tuyến vào 1 nhóm, sáng trước chiều sau ──────
const groupTripsByRoute = (trips) => {
  const map = new Map();
  const ORDER = { morning_pickup: 0, afternoon_dropoff: 1, custom: 2 };
  trips.forEach(t => {
    const key = t.route_id;
    if (!map.has(key)) map.set(key, { route: t.Route, route_id: key, trips: [] });
    map.get(key).trips.push(t);
  });
  map.forEach(group => {
    group.trips.sort((a, b) => (ORDER[a.trip_type] ?? 9) - (ORDER[b.trip_type] ?? 9));
  });
  return [...map.values()];
};

// Dùng mã màu trực tiếp (áp qua inline style) thay vì class Tailwind,
// vì class `divide-y divide-gray-50` trên container cha set border-color
// cho mọi cạnh của các dòng từ thứ 2 trở đi, ghi đè luôn border-left-color
// nếu dùng class border-l-*. Inline style luôn thắng nên tránh được xung đột này.
const STATUS_BORDER_COLOR = {
  in_progress: '#3b82f6', // blue-500
  completed:   '#22c55e', // green-500
  cancelled:   '#f87171', // red-400
  pending:     '#facc15', // yellow-400
};

const TripStatusBadge = ({ status }) => {
  const cfg = {
    pending:     { cls: 'bg-yellow-100 text-yellow-700', label: 'Chờ xuất phát' },
    in_progress: { cls: 'bg-blue-100 text-blue-700',     label: '🟢 Đang chạy' },
    completed:   { cls: 'bg-green-100 text-green-700',   label: '✅ Hoàn thành' },
    cancelled:   { cls: 'bg-red-100 text-red-700',       label: '❌ Đã hủy' },
  }[status] || { cls: 'bg-gray-100 text-gray-600', label: status };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.cls}`}>{cfg.label}</span>;
};

export default function ManagerTrips() {
  const [trips,    setTrips]    = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [date,     setDate]     = useState(dayjs().format('YYYY-MM-DD'));

  const [routes,   setRoutes]   = useState([]);
  const [drivers,  setDrivers]  = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [modal,         setModal]         = useState(false);
  const [form,          setForm]          = useState(initForm);
  const [saving,        setSaving]        = useState(false);
  const [confirm,       setConfirm]       = useState(null);
  const [creatingDaily, setCreatingDaily] = useState(false);

  // ── Fetch trips ───────────────────────────────────────────
  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tripApi.getTrips({ date });
      setTrips(data.data?.data || []);
      setTotal(data.data?.total || 0);
    } catch (e) {
      console.error('fetchTrips error:', e);
    } finally { setLoading(false); }
  }, [date]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  // ── Fetch dropdowns (routes/drivers/vehicles) ─────────────
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [rRes, dRes, vRes] = await Promise.all([
          getRoutes(),
          getDrivers(),
          getVehicles(),
        ]);
        setRoutes(rRes.data.data || []);
        setDrivers(dRes.data.data || []);
        setVehicles(vRes.data.data || []);
      } catch (e) {
        console.error('dropdown error:', e);
        toast.error('Không thể tải danh sách tuyến/tài xế/xe');
      }
    };
    loadDropdowns();
  }, []);

  // ── Auto-fill khi chọn tuyến ──────────────────────────────
  const handleRouteChange = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    setForm(f => ({
      ...f,
      route_id:   routeId,
      driver_id:  route?.driver_id  || '',
      vehicle_id: route?.vehicle_id || '',
    }));
  };

  const handleTripTypeChange = (type) => {
    setForm(f => ({
      ...f,
      trip_type:       type,
      scheduled_start: type === 'morning_pickup' ? '06:30' : '16:30',
    }));
  };

  // ── Tạo 1 chuyến ─────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.route_id)   return toast.error('Vui lòng chọn tuyến đường');
    if (!form.driver_id)  return toast.error('Vui lòng chọn tài xế');
    if (!form.vehicle_id) return toast.error('Vui lòng chọn xe buýt');
    setSaving(true);
    try {
      await tripApi.createTrip({ ...form, scheduled_start: form.scheduled_start + ':00' });
      toast.success('✅ Đã tạo chuyến đi!');
      setModal(false);
      fetchTrips();
    } catch {} finally { setSaving(false); }
  };

  // ── Tạo hàng loạt ────────────────────────────────────────
  const handleCreateDaily = async () => {
    setCreatingDaily(true);
    try {
      const { data } = await tripApi.createDaily(date);
      toast.success(`✅ Tạo ${data.data.created} chuyến, bỏ qua ${data.data.skipped} (đã có)`);
      fetchTrips();
    } catch {} finally { setCreatingDaily(false); }
  };

  // ── Hủy / Xóa ────────────────────────────────────────────
  const handleCancel = async (id) => {
    try { await tripApi.cancelTrip(id, 'Hủy bởi Manager'); toast.success('Đã hủy chuyến'); fetchTrips(); } catch {}
  };
  const handleDelete = async (id) => {
    try { await tripApi.deleteTrip(id); toast.success('Đã xóa chuyến'); fetchTrips(); } catch {}
  };

  const stats = {
    pending:   trips.filter(t => t.status === 'pending').length,
    running:   trips.filter(t => t.status === 'in_progress').length,
    completed: trips.filter(t => t.status === 'completed').length,
    cancelled: trips.filter(t => t.status === 'cancelled').length,
  };

  return (
    <div>
      <PageHeader
        title="Quản lý chuyến đi"
        subtitle={`${total} chuyến · ${dayjs(date).format('DD/MM/YYYY')}`}
        action={
          <div className="flex flex-wrap gap-2">
            <button onClick={handleCreateDaily} disabled={creatingDaily}
              className="btn-secondary text-sm">
              {creatingDaily ? '⏳ Đang tạo...' : '⚡ Tạo chuyến hàng loạt'}
            </button>
            <button onClick={() => { setForm({ ...initForm, scheduled_date: date }); setModal(true); }}
              className="btn-primary">
              + Tạo chuyến
            </button>
          </div>
        }
      />

      {/* Filter bar */}
      <div className="card mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-gray-600">📅 Xem ngày:</label>
        <input type="date" className="input w-44" value={date}
          onChange={e => setDate(e.target.value)} />
        <button onClick={fetchTrips} className="btn-secondary text-sm">🔄 Làm mới</button>
        <div className="ml-auto flex gap-2 text-xs">
          <span className="badge-yellow">{stats.pending} Chờ</span>
          <span className="badge-blue">{stats.running} Đang chạy</span>
          <span className="badge-green">{stats.completed} Hoàn thành</span>
          {stats.cancelled > 0 && <span className="badge-red">{stats.cancelled} Đã hủy</span>}
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
        💡 <strong>Tạo chuyến hàng loạt</strong>: tự động tạo chuyến Sáng + Chiều cho tất cả tuyến đang hoạt động.
        · <strong>Tạo chuyến</strong>: tạo thủ công 1 chuyến cụ thể.
      </div>

      {/* Trip list — grouped by route */}
      {loading ? <LoadingScreen /> : (
        <div className="space-y-4">
          {trips.length === 0 ? (
            <div className="card text-center py-14 text-gray-400">
              <div className="text-5xl mb-3">📋</div>
              <p className="font-medium">Chưa có chuyến nào ngày {dayjs(date).format('DD/MM/YYYY')}</p>
              <p className="text-sm mt-1">Nhấn <strong>"Tạo chuyến hàng loạt"</strong> để tạo tự động</p>
            </div>
          ) : groupTripsByRoute(trips).map(group => (
            <div key={group.route_id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Header tuyến */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <span className="text-base">🗺️</span>
                <span className="font-semibold text-gray-800 text-sm">{group.route?.route_name || '—'}</span>
                {group.route?.route_code && (
                  <span className="text-xs text-gray-400 ml-1">{group.route.route_code}</span>
                )}
                <span className="ml-auto text-xs text-gray-400">{group.trips.length} chuyến</span>
              </div>

              {/* Các chuyến trong tuyến */}
              <div className="divide-y divide-gray-50">
                {group.trips.map(t => (
                  <div key={t.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-3.5 border-l-4"
                    style={{ borderLeftColor: STATUS_BORDER_COLOR[t.status] || '#e5e7eb' }}>

                    {/* Loại + giờ */}
                    <div className="sm:w-32 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-700">{TRIP_TYPE_LABELS[t.trip_type]}</p>
                      <p className="text-xs text-gray-400 mt-0.5">⏰ {formatTime(t.scheduled_start)}</p>
                    </div>

                    {/* Xe + tài xế + số học sinh */}
                    <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-0.5 text-sm text-gray-600">
                      <p>🚌 {t.Vehicle?.plate_number || '—'}</p>
                      <p>👨‍✈️ {t.driver?.full_name || '—'}</p>
                      <p className="text-xs text-gray-400 col-span-2">
                        👨‍🎓 {t.boarded_count ?? 0}/{t.total_students ?? 0} học sinh đã lên xe
                      </p>
                    </div>

                    {/* Badge + actions */}
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      <TripStatusBadge status={t.status} />
                      {t.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setConfirm({ type:'cancel', id: t.id, name: `${group.route?.route_name || ''} · ${TRIP_TYPE_LABELS[t.trip_type]}` })}
                            className="text-yellow-600 hover:bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1 text-xs font-medium transition">
                            Hủy
                          </button>
                          <button
                            onClick={() => setConfirm({ type:'delete', id: t.id, name: `${group.route?.route_name || ''} · ${TRIP_TYPE_LABELS[t.trip_type]}` })}
                            className="text-red-500 hover:bg-red-50 border border-red-200 rounded-lg px-2 py-1 text-xs font-medium transition">
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal tạo chuyến */}
      <Modal open={modal} onClose={() => setModal(false)} title="+ Tạo chuyến đi" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày chạy <span className="text-red-500">*</span></label>
              <input type="date" className="input" value={form.scheduled_date}
                onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại chuyến <span className="text-red-500">*</span></label>
              <select className="input" value={form.trip_type} onChange={e => handleTripTypeChange(e.target.value)}>
                <option value="morning_pickup">🌅 Đón sáng</option>
                <option value="afternoon_dropoff">🌇 Trả chiều</option>
                <option value="custom">📋 Tùy chỉnh</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giờ xuất phát</label>
            <input type="time" className="input" value={form.scheduled_start}
              onChange={e => setForm(f => ({ ...f, scheduled_start: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến đường <span className="text-red-500">*</span></label>
            <select className="input" value={form.route_id} onChange={e => handleRouteChange(e.target.value)}>
              <option value="">— Chọn tuyến —</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.route_code} · {r.route_name}</option>
              ))}
            </select>
            {routes.length === 0 && <p className="text-xs text-red-400 mt-1">⚠️ Không tải được danh sách tuyến</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tài xế <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 ml-1">(tự điền nếu tuyến đã gán)</span>
            </label>
            <select className="input" value={form.driver_id}
              onChange={e => setForm(f => ({ ...f, driver_id: e.target.value }))}>
              <option value="">— Chọn tài xế —</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>👨‍✈️ {d.full_name} · {d.phone}</option>
              ))}
            </select>
            {drivers.length === 0 && <p className="text-xs text-red-400 mt-1">⚠️ Không tải được danh sách tài xế</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xe buýt <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 ml-1">(tự điền nếu tuyến đã gán)</span>
            </label>
            <select className="input" value={form.vehicle_id}
              onChange={e => setForm(f => ({ ...f, vehicle_id: e.target.value }))}>
              <option value="">— Chọn xe —</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>🚌 {v.plate_number} · {v.vehicle_name} ({v.capacity} chỗ)</option>
              ))}
            </select>
            {vehicles.length === 0 && <p className="text-xs text-red-400 mt-1">⚠️ Không tải được danh sách xe</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-secondary flex-1">Hủy</button>
            <button onClick={handleCreate} disabled={saving} className="btn-primary flex-1 py-3">
              {saving ? '⏳ Đang tạo...' : '🚌 Tạo chuyến đi'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm.type === 'cancel') handleCancel(confirm.id);
          else handleDelete(confirm.id);
          setConfirm(null);
        }}
        title={confirm?.type === 'cancel' ? 'Hủy chuyến' : 'Xóa chuyến'}
        message={`${confirm?.type === 'cancel' ? 'Hủy' : 'Xóa'} chuyến "${confirm?.name}"?`}
        danger
      />
    </div>
  );
}