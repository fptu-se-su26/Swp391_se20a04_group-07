import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api';
import { PageHeader, Modal, LoadingScreen, StatusBadge, ConfirmDialog } from '../../components/common';
import toast from 'react-hot-toast';
import api from '../../api/axios';

// ── API helpers ──────────────────────────────────────────────
const routeApi = {
  getDrivers: () => api.get('/admin/users', { params: { role: 'driver', limit: 100 } }),
  getVehicles: () => api.get('/admin/vehicles'),
  deleteRoute:(id) => api.delete(`/admin/routes/${id}`),
  updateRoute:(id, data) => api.put(`/admin/routes/${id}`, data),
};

const initForm = {
  route_name:        '',
  route_code:        '',
  estimated_duration:'',
  driver_id:         '',
  vehicle_id:        '',
};

// Tìm xe đang gán cho 1 tài xế (nếu có)
function findVehicleByDriver(vehicles, driverId) {
  return vehicles.find(v => v.driver?.id === driverId || v.current_driver_id === driverId);
}

// Tìm tuyến khác (không phải tuyến đang sửa) mà tài xế này đã được phân công
function findConflictRoute(routes, driverId, excludeRouteId) {
  return routes.find(r => r.driver_id === driverId && r.id !== excludeRouteId);
}

export default function RoutesPage() {
  const [routes,   setRoutes]   = useState([]);
  const [drivers,  setDrivers]  = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Modals
  const [modal,    setModal]    = useState(null); // 'add' | 'edit'
  const [selected, setSelected] = useState(null);
  const [form,     setForm]     = useState(initForm);
  const [confirm,  setConfirm]  = useState(null);
  const [saving,   setSaving]   = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [routeRes, driverRes, vehicleRes] = await Promise.all([
        adminApi.getRoutes(),
        routeApi.getDrivers(),
        routeApi.getVehicles(),
      ]);
      setRoutes(routeRes.data.data);
      setDrivers(driverRes.data.data.data || []);
      setVehicles(vehicleRes.data.data || []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Open modals ───────────────────────────────────────────
  const openAdd = () => {
    setSelected(null);
    setForm(initForm);
    setModal('add');
  };

  const openEdit = (r) => {
    setSelected(r);
    setForm({
      route_name:         r.route_name        || '',
      route_code:         r.route_code        || '',
      estimated_duration: r.estimated_duration|| '',
      driver_id:          r.driver_id         || '',
      vehicle_id:         r.vehicle_id        || '',
    });
    setModal('edit');
  };

  // ── Save / Delete ─────────────────────────────────────────
  const handleSave = async () => {
    if (!form.route_name.trim()) return toast.error('Vui lòng nhập tên tuyến');
    setSaving(true);
    try {
      if (modal === 'add') {
        await adminApi.createRoute(form);
        toast.success('Đã tạo tuyến đường');
      } else {
        await routeApi.updateRoute(selected.id, form);
        toast.success('Đã cập nhật tuyến đường');
      }
      setModal(null);
      fetchAll();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await routeApi.deleteRoute(id);
      toast.success('Đã xóa tuyến');
      fetchAll();
    } catch {}
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader
        title="Quản lý tuyến đường"
        subtitle={`${routes.length} tuyến`}
        action={<button onClick={openAdd} className="btn-primary">+ Thêm tuyến</button>}
      />

      {/* Route list */}
      <div className="space-y-4">
        {routes.length === 0 && (
          <div className="card text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🗺️</div>
            <p>Chưa có tuyến đường nào</p>
          </div>
        )}
        {routes.map(r => (
          <div key={r.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-base">🗺️ {r.route_name}</h3>
                  <StatusBadge status={r.is_active ? 'active' : 'inactive'} />
                </div>
                <p className="text-sm text-gray-500">
                  Mã: <strong>{r.route_code || '—'}</strong>
                  {r.estimated_duration ? ` · ~${r.estimated_duration} phút` : ''}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button onClick={() => openEdit(r)}
                  className="text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 text-xs font-medium transition">
                  ✏️ Sửa
                </button>
                <button onClick={() => setConfirm({ id: r.id, name: r.route_name })}
                  className="text-red-600 hover:bg-red-50 border border-red-200 rounded-lg px-3 py-1 text-xs font-medium transition">
                  🗑️ Xóa
                </button>
              </div>
            </div>

            {/* Vehicle & Driver */}
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <span>🚌</span>
                <span>Xe: <strong>{r.Vehicle?.plate_number || 'Chưa gán'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>👨‍✈️</span>
                <span>Tài xế: <strong>{r.driver?.full_name || 'Chưa gán'}</strong></span>
              </div>
            </div>

            {/* Ghi chú: học sinh trên tuyến này được đón/trả tận nhà theo địa chỉ đã đăng ký */}
            <p className="mt-3 text-xs text-gray-400">
              🏠 Học sinh trên tuyến được đón/trả tận nhà theo địa chỉ đã đăng ký.
            </p>
          </div>
        ))}
      </div>

      {/* ── Modal Thêm/Sửa tuyến ── */}
      <Modal
        open={modal === 'add' || modal === 'edit'}
        onClose={() => setModal(null)}
        title={modal === 'add' ? '+ Thêm tuyến đường' : '✏️ Chỉnh sửa tuyến'}
        size="md"
      >
        <div className="space-y-4">
          {/* Tên tuyến */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên tuyến <span className="text-red-500">*</span>
            </label>
            <input className="input" placeholder="VD: Tuyến Quận 1 - Trường"
              value={form.route_name}
              onChange={e => setForm(f => ({ ...f, route_name: e.target.value }))} />
          </div>

          {/* Mã tuyến + Thời gian */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã tuyến</label>
              <input className="input" placeholder="VD: R001"
                value={form.route_code}
                onChange={e => setForm(f => ({ ...f, route_code: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
              <input type="number" className="input" placeholder="VD: 45"
                value={form.estimated_duration}
                onChange={e => setForm(f => ({ ...f, estimated_duration: e.target.value }))} />
            </div>
          </div>

          {/* Tài xế */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tài xế</label>
            <select className="input" value={form.driver_id}
              onChange={e => {
                const driverId = e.target.value;
                const matchedVehicle = driverId ? findVehicleByDriver(vehicles, driverId) : null;
                setForm(f => ({
                  ...f,
                  driver_id: driverId,
                  // Tự động chọn xe đã gán cho tài xế này (nếu có), giữ nguyên nếu không tìm thấy
                  vehicle_id: matchedVehicle ? matchedVehicle.id : f.vehicle_id,
                }));
              }}>
              <option value="">— Chưa phân công —</option>
              {drivers.map(d => {
                const conflict = findConflictRoute(routes, d.id, selected?.id);
                return (
                  <option key={d.id} value={d.id}>
                    🚌 {d.full_name} · {d.phone}
                    {conflict ? ` ⚠️ (đã phân công tuyến "${conflict.route_name}")` : ''}
                  </option>
                );
              })}
            </select>
            {form.driver_id && findConflictRoute(routes, form.driver_id, selected?.id) && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Tài xế này đang phụ trách tuyến "{findConflictRoute(routes, form.driver_id, selected?.id).route_name}". Gán vào tuyến này sẽ không tự động gỡ khỏi tuyến kia.
              </p>
            )}
          </div>

          {/* Xe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xe buýt</label>
            <select className="input" value={form.vehicle_id}
              onChange={e => setForm(f => ({ ...f, vehicle_id: e.target.value }))}>
              <option value="">— Chưa gán xe —</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>🚌 {v.plate_number} · {v.vehicle_name} ({v.capacity} chỗ)</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="btn-secondary flex-1">Hủy</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Đang lưu...' : modal === 'add' ? 'Tạo tuyến' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm xóa */}
      <ConfirmDialog
        open={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={() => { handleDelete(confirm?.id); setConfirm(null); }}
        title="Xóa tuyến đường"
        message={`Bạn có chắc muốn xóa tuyến "${confirm?.name}"?`}
        danger
      />
    </div>
  );
}
