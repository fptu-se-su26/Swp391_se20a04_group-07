// ============================================================
// STUDENT SCHEDULE PAGE  (src/pages/student/Schedule.jsx)
// Redesign: thẻ thống kê + thanh chuyển tuần (hoạt động thật, có
// gọi API với tham số ngày) + lưới Buổi sáng/Buổi chiều theo 7 cột
// ngày + mini calendar + panel thông tin học sinh.
// ============================================================
import React, { useEffect, useMemo, useState } from 'react';
import { studentApi } from '../../api';
import { PageHeader, LoadingScreen, StatCard, StatusBadge } from '../../components/common';
import { useIsMobile } from '../../hooks/useIsMobile';
import dayjs from 'dayjs';

const WEEKDAY_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// ── Format giờ an toàn ─────────────────────────────────────────
// Backend có thể trả "08:00:00" (TIME thuần) hoặc dạng ISO
// "1970-01-01T08:00:00.000Z" (Sequelize serialize cột TIME thành
// Date ở mốc epoch). Hàm này luôn lấy đúng HH:MM, không dùng
// new Date() để tránh lệch giờ do đổi múi giờ.
const formatTime = (val) => {
  if (!val) return '--:--';
  const str = String(val);
  const timePart = str.includes('T') ? str.split('T')[1] : str;
  return timePart ? timePart.slice(0, 5) : '--:--';
};

// ============================================================
// GIAO DIỆN ĐIỆN THOẠI — dải ngày trong tuần (dạng vòng tròn) +
// timeline dọc theo từng ngày, mỗi buổi là 1 thẻ có vạch màu.
// ============================================================
function MobileScheduleView({ weekDates, grouped, anchor, todayStr, meta, onPrev, onNext, onToday, onPickDay, loading }) {
  return (
    <div className="-mx-4 -mt-4">
      {/* Thanh chuyển tuần */}
      <div className="px-4 pt-4 pb-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onPrev} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200">‹</button>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800">
              {meta ? `${dayjs(meta.monday).format('DD/MM')} – ${dayjs(meta.sunday).format('DD/MM/YYYY')}` : '—'}
            </p>
            {anchor !== todayStr ? (
              <button onClick={onToday} className="text-xs text-primary-600 font-medium">Về tuần này</button>
            ) : (
              <p className="text-xs text-gray-400">Tuần hiện tại</p>
            )}
          </div>
          <button onClick={onNext} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200">›</button>
        </div>

        {/* Dải ngày trong tuần */}
        <div className="flex justify-between gap-0.5">
          {weekDates.map(d => {
            const key = d.format('YYYY-MM-DD');
            const isToday   = d.isSame(dayjs(), 'day');
            const isPicked  = d.isSame(dayjs(anchor), 'day');
            const hasTrip   = !!grouped[key];
            return (
              <button key={key} onClick={() => onPickDay(d)}
                className="flex flex-col items-center gap-1 flex-1 py-1">
                <span className="text-[11px] text-gray-400">{WEEKDAY_SHORT[d.day() === 0 ? 6 : d.day() - 1]}</span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                  ${isToday ? 'bg-primary-600 text-white' : isPicked ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}`}>
                  {d.format('D')}
                </span>
                <span className={`w-1 h-1 rounded-full ${hasTrip ? 'bg-primary-500' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline dọc theo từng ngày */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="py-10 text-center text-gray-400 text-sm">Đang tải...</div>
        ) : (
          <div className="space-y-5">
            {weekDates.map(d => {
              const key = d.format('YYYY-MM-DD');
              const dayTrips = (grouped[key] || []).slice().sort(
                (a, b) => (a.trip_type === 'morning_pickup' ? -1 : 1) - (b.trip_type === 'morning_pickup' ? -1 : 1)
              );
              const isToday = d.isSame(dayjs(), 'day');
              return (
                <div key={key} className="flex gap-3">
                  <div className="w-12 flex-shrink-0 text-center pt-1.5">
                    <p className={`text-base font-bold leading-none ${isToday ? 'text-primary-600' : 'text-gray-700'}`}>{d.format('DD/MM')}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{WEEKDAY_SHORT[d.day() === 0 ? 6 : d.day() - 1]}</p>
                  </div>
                  <div className="flex-1 min-w-0 pb-1 border-b border-gray-50">
                    {dayTrips.length === 0 ? (
                      <p className="text-xs text-gray-300 pt-2 pb-3">Không có lịch trình</p>
                    ) : (
                      <div className="space-y-2.5 pb-3">
                        {dayTrips.map(t => {
                          const isMorning = t.trip_type === 'morning_pickup';
                          const att = t.TripAttendances?.[0];
                          return (
                            <div key={t.id} className="flex gap-2.5">
                              <div className={`w-1 rounded-full flex-shrink-0 ${isMorning ? 'bg-orange-400' : 'bg-emerald-500'}`} />
                              <div className="flex-1 min-w-0 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap
                                    ${isMorning ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {isMorning ? '🌅 Đón sáng' : '🌇 Trả chiều'}
                                  </span>
                                  <span className="text-xs font-semibold text-gray-500 flex-shrink-0">⏰ {formatTime(t.scheduled_start)}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-800 break-words leading-snug">{t.Route?.route_name || '—'}</p>
                                {att && <div className="mt-2">{<StatusBadge status={att.status} />}</div>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentSchedule() {
  const isMobile = useIsMobile();
  const todayStr = dayjs().format('YYYY-MM-DD');

  const [anchor, setAnchor]   = useState(todayStr); // ngày neo để BE tính tuần chứa nó
  const [trips, setTrips]     = useState([]);
  const [meta, setMeta]       = useState(null);      // { monday, sunday } trả về từ BE
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calMonth, setCalMonth] = useState(dayjs());

  // Thông tin học sinh — gọi 1 lần
  useEffect(() => {
    studentApi.getProfile()
      .then(r => setProfile(r.data.data))
      .catch(() => {});
  }, []);

  // Lịch tuần — gọi lại mỗi khi đổi tuần (anchor đổi)
  useEffect(() => {
    setLoading(true);
    studentApi.getWeekSchedule(anchor)
      .then(r => {
        setTrips(r.data.data || []);
        setMeta(r.data.meta || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [anchor]);

  // 7 ngày Thứ 2 -> Chủ Nhật của tuần đang xem, dựa vào meta từ BE
  const weekDates = useMemo(() => {
    if (!meta) return [];
    const start = dayjs(meta.monday);
    return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
  }, [meta]);

  // Gom chuyến theo ngày để tra cứu nhanh khi render lưới
  const grouped = useMemo(() => {
    return trips.reduce((acc, t) => {
      (acc[t.scheduled_date] ||= []).push(t);
      return acc;
    }, {});
  }, [trips]);

  const morningCount   = trips.filter(t => t.trip_type === 'morning_pickup').length;
  const afternoonCount = trips.filter(t => t.trip_type === 'afternoon_dropoff').length;
  const boardedCount   = trips.filter(t => t.TripAttendances?.[0]?.status === 'boarded').length;

  const goPrevWeek = () => setAnchor(d => dayjs(d).subtract(7, 'day').format('YYYY-MM-DD'));
  const goNextWeek = () => setAnchor(d => dayjs(d).add(7, 'day').format('YYYY-MM-DD'));
  const goThisWeek = () => { setAnchor(todayStr); setCalMonth(dayjs()); };
  const pickDate   = (d) => { setAnchor(d.format('YYYY-MM-DD')); setCalMonth(d); };

  // Lưới mini calendar (bắt đầu từ Thứ 2), 6 hàng x 7 cột = 42 ô
  const calDays = useMemo(() => {
    const startOfMonth  = calMonth.startOf('month');
    const startWeekday  = (startOfMonth.day() + 6) % 7; // 0 = Thứ 2
    const gridStart     = startOfMonth.subtract(startWeekday, 'day');
    return Array.from({ length: 42 }, (_, i) => gridStart.add(i, 'day'));
  }, [calMonth]);

  const tripDateSet = useMemo(() => new Set(trips.map(t => t.scheduled_date)), [trips]);

  if (loading && !meta) return <LoadingScreen />;

  if (isMobile) {
    return (
      <div>
        <PageHeader title="📅 Lịch tuần" subtitle={trips.length > 0 ? `${trips.length} chuyến trong tuần` : undefined} />
        <MobileScheduleView
          weekDates={weekDates}
          grouped={grouped}
          anchor={anchor}
          todayStr={todayStr}
          meta={meta}
          onPrev={goPrevWeek}
          onNext={goNextWeek}
          onToday={goThisWeek}
          onPickDay={pickDate}
          loading={loading}
        />
      </div>
    );
  }

  const renderTripCell = (dateStr, tripType) => {
    const dayTrips = (grouped[dateStr] || []).filter(t => t.trip_type === tripType);
    if (dayTrips.length === 0) {
      return (
        <div className="h-full min-h-[64px] rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-300">
          Không có lịch trình
        </div>
      );
    }
    return (
      <div className="space-y-1.5">
        {dayTrips.map(t => {
          const att = t.TripAttendances?.[0];
          return (
            <div key={t.id} className="rounded-lg border border-gray-100 bg-gray-50 p-2">
              <p className="text-xs font-semibold text-gray-700">⏰ {formatTime(t.scheduled_start)}</p>
              <p className="text-xs text-gray-500 break-words leading-snug">{t.Route?.route_name || '—'}</p>
              {att && <div className="mt-1"><StatusBadge status={att.status} /></div>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="📅 Chuyến đi"
        subtitle={trips.length > 0 ? `${trips.length} chuyến · Thứ 2 - Chủ Nhật` : 'Thứ 2 - Chủ Nhật'}
      />

      {/* ── Thẻ thống kê ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Tổng chuyến trong tuần" value={trips.length} icon="🗓️" color="blue" sub="chuyến" />
        <StatCard label="Chuyến sáng" value={morningCount} icon="🌅" color="yellow" sub="chuyến" />
        <StatCard label="Chuyến chiều" value={afternoonCount} icon="🌇" color="purple" sub="chuyến" />
        <StatCard label="Đã lên xe" value={boardedCount} icon="✅" color="green" sub="/ tổng chuyến" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Cột chính: thanh chuyển tuần + lưới lịch ────────── */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="card flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-gray-700">
              Tuần này: {meta ? `${dayjs(meta.monday).format('DD/MM/YYYY')} - ${dayjs(meta.sunday).format('DD/MM/YYYY')}` : '—'}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={goPrevWeek} className="btn-secondary px-3 py-1.5 text-sm">◀</button>
              <button onClick={goThisWeek} className={`px-3 py-1.5 text-sm rounded-lg font-medium border transition-colors
                ${anchor === todayStr ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                Kế tiếp
              </button>
              <button onClick={goNextWeek} className="btn-secondary px-3 py-1.5 text-sm">▶</button>
            </div>
          </div>

          <div className="card overflow-x-auto">
            {loading ? (
              <div className="py-10 text-center text-gray-400 text-sm">Đang tải...</div>
            ) : weekDates.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">Không có dữ liệu tuần này</div>
            ) : (
              <div>
                {/* Header 7 ngày */}
                <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: '96px repeat(7, minmax(110px, 1fr))' }}>
                  <div className="sticky left-0 bg-white" />
                  {weekDates.map(d => {
                    const isToday = d.isSame(dayjs(), 'day');
                    return (
                      <div key={d.format('YYYY-MM-DD')}
                        className={`text-center py-2 rounded-lg ${isToday ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>
                        <p className="text-xs font-medium opacity-80">{WEEKDAY_SHORT[d.day() === 0 ? 6 : d.day() - 1]}</p>
                        <p className="text-sm font-bold">{d.format('DD/MM')}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Hàng Buổi sáng */}
                <div className="grid gap-2 mb-2 items-stretch" style={{ gridTemplateColumns: '96px repeat(7, minmax(110px, 1fr))' }}>
                  <div className="sticky left-0 z-10 bg-white flex flex-col justify-center pr-1">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">🌅 BUỔI SÁNG</p>
                    <p className="text-[11px] text-gray-400 leading-tight">06:00-08:00</p>
                  </div>
                  {weekDates.map(d => (
                    <div key={d.format('YYYY-MM-DD')}>{renderTripCell(d.format('YYYY-MM-DD'), 'morning_pickup')}</div>
                  ))}
                </div>

                {/* Hàng Buổi chiều */}
                <div className="grid gap-2 items-stretch" style={{ gridTemplateColumns: '96px repeat(7, minmax(110px, 1fr))' }}>
                  <div className="sticky left-0 z-10 bg-white flex flex-col justify-center pr-1">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">🌇 BUỔI CHIỀU</p>
                    <p className="text-[11px] text-gray-400 leading-tight">16:00-18:00</p>
                  </div>
                  {weekDates.map(d => (
                    <div key={d.format('YYYY-MM-DD')}>{renderTripCell(d.format('YYYY-MM-DD'), 'afternoon_dropoff')}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Cột phụ: mini calendar + thông tin học sinh + lưu ý ── */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
          {/* Mini calendar */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setCalMonth(m => m.subtract(1, 'month'))} className="text-gray-400 hover:text-gray-600 px-2">‹</button>
              <p className="text-sm font-semibold text-gray-800">Tháng {calMonth.format('M, YYYY')}</p>
              <button onClick={() => setCalMonth(m => m.add(1, 'month'))} className="text-gray-400 hover:text-gray-600 px-2">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
              {WEEKDAY_SHORT.map(w => <span key={w}>{w}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calDays.map(d => {
                const key = d.format('YYYY-MM-DD');
                const inMonth  = d.month() === calMonth.month();
                const isToday  = d.isSame(dayjs(), 'day');
                const isPicked = d.isSame(dayjs(anchor), 'day');
                const hasTrip  = tripDateSet.has(key);
                return (
                  <button key={key} onClick={() => pickDate(d)}
                    className={`relative aspect-square rounded-lg text-xs flex items-center justify-center transition-colors
                      ${!inMonth ? 'text-gray-300' : 'text-gray-700'}
                      ${isPicked ? 'bg-primary-600 text-white font-semibold' : isToday ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-gray-100'}`}>
                    {d.format('D')}
                    {hasTrip && !isPicked && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-primary-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thông tin học sinh */}
          <div className="card">
            <p className="text-sm font-semibold text-gray-800 mb-3">👤 Thông tin học sinh</p>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Họ và tên</p>
                <p className="text-gray-800 font-medium">{profile?.full_name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Mã học sinh</p>
                <p className="text-gray-800 font-medium">{profile?.student_id || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Lớp</p>
                <p className="text-gray-800 font-medium">{profile?.classInfo?.class_name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-gray-800 font-medium truncate">{profile?.student_email || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
