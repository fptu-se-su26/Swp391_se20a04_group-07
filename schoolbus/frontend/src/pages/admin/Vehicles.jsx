// ============================================================
// VEHICLES PAGE  (src/pages/admin/Vehicles.jsx)
// ============================================================
import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api';
import { PageHeader, Modal, StatusBadge, LoadingScreen, ConfirmDialog } from '../../components/common';
import toast from 'react-hot-toast';

const initVehicle = { plate_number:'', vehicle_name:'', brand:'', capacity:30, status:'active', driver_id:'' };

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(initVehicle);
  const [editing, setEditing]   = useState(null);
  const [confirm, setConfirm]   = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const {data} = await adminApi.getVehicles(); setVehicles(data.data); }
    catch {} finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  // Danh sách tài xế cho dropdown phân công
  const fetchDrivers = useCallback(async () => {
    try {
      const {data} = await adminApi.getUsers({ role: 'driver', limit: 200 });
      // getUsers khi filter theo role trả về { total, page, limit, data: [...] }
      // -> response.data.data là object đó, mảng thật nằm ở data.data.data
      setDrivers(data.data?.data || []);
    }
    catch {}
  }, []);
  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  const open = (v = null) => {
    setEditing(v);
    setForm(v ? {
      plate_number: v.plate_number, vehicle_name: v.vehicle_name || '', brand: v.brand || '',
      capacity: v.capacity, status: v.status, driver_id: v.driver?.id || v.current_driver_id || '',
    } : initVehicle);
    setModal(true);
  };

  const save = async () => {
    try {
      if (editing) { await adminApi.updateVehicle(editing.id, form); toast.success('Đã cập nhật xe'); }
      else { await adminApi.createVehicle(form); toast.success('Đã thêm xe'); }
      setModal(false); fetch(); fetchDrivers();
    } catch {}
  };

  const del = async (id) => {
    try { await adminApi.deleteVehicle(id); toast.success('Đã xóa xe'); fetch(); } catch {}
  };

  if (loading && !vehicles.length) return <LoadingScreen />;
  return (
    <div>
      <PageHeader title="Quản lý xe buýt" subtitle={`${vehicles.length} xe`} action={<button onClick={() => open()} className="btn-primary">+ Thêm xe</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(v => (
          <div key={v.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">🚌 {v.plate_number}</h3>
                <p className="text-sm text-gray-500">{v.vehicle_name} · {v.brand}</p>
              </div>
              <StatusBadge status={v.status} />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>👥 Sức chứa: <strong>{v.capacity}</strong> chỗ</p>
              <p>👨‍✈️ Tài xế: <strong>{v.driver?.full_name || 'Chưa phân công'}</strong></p>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => open(v)} className="btn-secondary text-xs py-1 flex-1">✏️ Sửa</button>
              <button onClick={() => setConfirm({ id: v.id, name: v.plate_number })} className="btn-danger text-xs py-1 flex-1">🗑️ Xóa</button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Chỉnh sửa xe' : 'Thêm xe mới'}>
        <div className="space-y-4">
          {[['plate_number','Biển số xe'],['vehicle_name','Tên xe'],['brand','Hãng xe']].map(([f,l]) => (
            <div key={f}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
              <input className="input" value={form[f]} onChange={e => setForm(p => ({...p, [f]: e.target.value}))} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa</label>
            <input type="number" className="input" value={form.capacity} onChange={e => setForm(p => ({...p, capacity: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select className="input" value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))}>
              <option value="active">Hoạt động</option>
              <option value="maintenance">Bảo trì</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tài xế phụ trách</label>
            <select className="input" value={form.driver_id} onChange={e => setForm(p => ({...p, driver_id: e.target.value}))}>
              <option value="">— Chưa phân công —</option>
              {drivers.map(d => {
                const assignedElsewhere = vehicles.some(v => v.driver?.id === d.id && v.id !== editing?.id);
                return (
                  <option key={d.id} value={d.id}>
                    {d.full_name}{d.phone ? ` · ${d.phone}` : ''}{assignedElsewhere ? ' (đang phụ trách xe khác)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-secondary flex-1">Hủy</button>
            <button onClick={save} className="btn-primary flex-1">Lưu</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm?.id)}
        title="Xóa xe" message={`Xóa xe ${confirm?.name}?`} danger />
    </div>
  );
}

export default VehiclesPage;
