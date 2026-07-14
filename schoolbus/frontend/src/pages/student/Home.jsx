import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api';
import { useAuth } from '../../context';
import { PageHeader, LoadingScreen, StatusBadge } from '../../components/common';
import dayjs from 'dayjs';

const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function StudentHome() {
  const { user } = useAuth();
  const [route, setRoute]       = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      studentApi.getMyRoute(),
      studentApi.getWeekSchedule(),
    ]).then(([r, s]) => {
      setRoute(r.data.data);
      setSchedule(s.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <PageHeader title={`Xin chào, ${user?.full_name}! 🎒`} subtitle={dayjs().format('dddd, DD/MM/YYYY')} />

      <div className="space-y-5 max-w-3xl">
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

        {/* Week schedule — tóm tắt, xem chi tiết ở trang riêng */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">📅 Lịch tuần này</h3>
            <Link to="/student/schedule" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              Xem lịch đầy đủ →
            </Link>
          </div>
          {schedule.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Không có chuyến nào tuần này</p>
          ) : (
            <>
              {(() => {
                const todayTrips = schedule.filter(t => dayjs(t.scheduled_date).isSame(dayjs(), 'day'));
                if (todayTrips.length === 0) {
                  return <p className="text-gray-400 text-sm text-center py-4">Hôm nay không có chuyến nào — có {schedule.length} chuyến trong tuần</p>;
                }
                return (
                  <div className="space-y-2">
                    {todayTrips.map((trip, i) => {
                      const att = trip.TripAttendances?.[0];
                      return (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-teal-50 border-teal-200">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold bg-teal-600 text-white">
                              {DAYS_VI[dayjs(trip.scheduled_date).day()]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-teal-700">
                                {trip.trip_type === 'morning_pickup' ? '🌅 Đón sáng' : '🌇 Trả chiều'}
                              </p>
                              <p className="text-xs text-gray-400">{trip.Route?.route_name}</p>
                            </div>
                          </div>
                          {att && <StatusBadge status={att.status} />}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
