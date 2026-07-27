import React, { useEffect, useState } from 'react';
import { parentApi } from '../../api';
import { PageHeader, LoadingScreen, StatusBadge, Modal } from '../../components/common';
import { useAuth } from '../../context';
import toast from 'react-hot-toast';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [busStatus, setBusStatus] = useState({});
  const [loading, setLoading]    = useState(true);
  const [linkModal, setLinkModal] = useState(false);
  const [linkCode, setLinkCode]  = useState('');

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const { data } = await parentApi.getChildren();
      setChildren(data.data);
      // Fetch bus status for each child
      const statuses = {};
      await Promise.all(data.data.map(async (c) => {
        try {
          const r = await parentApi.getBusStatus(c.id);
          statuses[c.id] = r.data.data;
        } catch {}
      }));
      setBusStatus(statuses);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchChildren(); }, []);

  const handleLink = async () => {
    if (!linkCode.trim()) return toast.error('Vui lòng nhập email học sinh');
    try {
      await parentApi.linkChild({ studentCode: linkCode });
      toast.success('Đã liên kết học sinh!');
      setLinkModal(false);
      setLinkCode('');
      fetchChildren();
    } catch {}
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader
        title={`Xin chào, ${user?.full_name}! 👋`}
        subtitle="Theo dõi con bạn và các chuyến xe đưa đón"
      />

      {children.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có học sinh nào</h3>
          <p className="text-gray-500 text-sm mb-5">Thêm học sinh để bắt đầu theo dõi</p>
          <button onClick={() => setLinkModal(true)} className="btn-primary">+ Thêm học sinh</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {children.map(child => {
            const trips = busStatus[child.id] || [];
            const activeTrip = trips.find(t => t.status === 'in_progress');
            const myAttendance = activeTrip?.TripAttendances?.[0];
            return (
              <div key={child.id} className="card hover:shadow-md transition-shadow">
                {/* Child header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold shadow">
                    {child.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{child.full_name}</h3>
                    <p className="text-xs text-gray-500">{child.email}</p>
                  </div>
                </div>

                {/* Bus status */}
                {activeTrip ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">🚌 Xe đang vận hành</span>
                      {myAttendance && <StatusBadge status={myAttendance.status} />}
                    </div>
                    <p className="text-xs text-green-600">{activeTrip.Route?.route_name}</p>
                    <p className="text-xs text-gray-500 mt-1">👨‍✈️ {activeTrip.driver?.full_name} · 📞 {activeTrip.driver?.phone}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-3 mb-3 text-center">
                    <p className="text-sm text-gray-400">🚌 Không có chuyến nào đang chạy</p>
                  </div>
                )}

                {/* Today's trips */}
                {trips.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hôm nay</p>
                    {trips.map(t => (
                      <div key={t.id} className="flex items-center justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                        <span className="text-gray-600">{t.trip_type === 'morning_pickup' ? '🌅 Đón sáng' : '🌇 Trả chiều'}</span>
                        <StatusBadge status={t.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Link Child Modal */}
      <Modal open={linkModal} onClose={() => setLinkModal(false)} title="Thêm học sinh" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Nhập email tài khoản của con bạn để liên kết.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email học sinh</label>
            <input className="input" placeholder="student@example.com"
              value={linkCode} onChange={e => setLinkCode(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setLinkModal(false)} className="btn-secondary flex-1">Hủy</button>
            <button onClick={handleLink} className="btn-primary flex-1">Liên kết</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
