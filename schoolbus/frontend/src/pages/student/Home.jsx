import React, { useEffect, useState } from 'react';
import { studentApi } from '../../api';
import { useAuth } from '../../context';
import { PageHeader, LoadingScreen, StatusBadge } from '../../components/common';
import dayjs from 'dayjs';

const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function StudentHome() {
  const { user } = useAuth();
  const [route, setRoute]       = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [notifs, setNotifs]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      studentApi.getMyRoute(),
      studentApi.getWeekSchedule(),
      studentApi.getNotifications(),
    ]).then(([r, s, n]) => {
      setRoute(r.data.data);
      setSchedule(s.data.data);
      setNotifs(n.data.data.slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const today = dayjs().day(); // 0=Sun

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <PageHeader title={`Xin chào, ${user?.full_name}! 🎒`} subtitle={dayjs().format('dddd, DD/MM/YYYY')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Route info + schedule */}
        <div className="lg:col-span-2 space-y-5">
          {/* My route */}
          {route ? (
            <div className="card bg-gradient-to-r from-teal-500 to-teal-600 text-white">
              <h3 className="font-semibold mb-2">🗺️ Tuyến xe của bạn</h3>
              <p className="text-xl font-bold">{route.Route?.route_name}</p>
              <p className="text-teal-100 text-sm mt-1">Mã tuyến: {route.Route?.route_code}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {route.Route?.RouteStops?.map(s => (
                  <span key={s.id} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">📍 {s.stop_name}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="card text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">🗺️</p>
              <p>Chưa đăng ký tuyến xe nào</p>
            </div>
          )}

          {/* Week schedule */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-3">📅 Lịch tuần này</h3>
            {schedule.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Không có chuyến nào tuần này</p>
            ) : (
              <div className="space-y-2">
                {schedule.map((trip, i) => {
                  const d = dayjs(trip.scheduled_date);
                  const isToday = d.isSame(dayjs(), 'day');
                  const att = trip.TripAttendances?.[0];
                  return (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border
                      ${isToday ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold
                          ${isToday ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          {DAYS_VI[d.day()]}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isToday ? 'text-teal-700' : 'text-gray-700'}`}>
                            {d.format('DD/MM')} · {trip.trip_type === 'morning_pickup' ? '🌅 Đón sáng' : '🌇 Trả chiều'}
                          </p>
                          <p className="text-xs text-gray-400">{trip.Route?.route_name}</p>
                        </div>
                      </div>
                      {att && <StatusBadge status={att.status} />}
                      {isToday && <span className="badge-blue ml-1">Hôm nay</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications */}
        <div>
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-3">🔔 Thông báo gần đây</h3>
            <div className="space-y-2">
              {notifs.map(n => (
                <div key={n.id} className={`p-3 rounded-lg text-sm ${n.is_read ? 'bg-gray-50' : 'bg-primary-50 border border-primary-100'}`}>
                  <p className="font-medium text-gray-800">{n.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{n.body}</p>
                  <p className="text-gray-400 text-xs mt-1">{dayjs(n.sent_at).fromNow()}</p>
                </div>
              ))}
              {notifs.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Không có thông báo</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
