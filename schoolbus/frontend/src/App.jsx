import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, SocketProvider, useAuth } from './context';

// Public
const LoginPage    = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPage   = lazy(() => import('./pages/ForgotPage'));

// Admin
const AdminLayout    = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers     = lazy(() => import('./pages/admin/Users'));
const AdminStudents  = lazy(() => import('./pages/admin/Students'));
const AdminVehicles  = lazy(() => import('./pages/admin/Vehicles'));
const AdminRoutes    = lazy(() => import('./pages/admin/RoutesPage'));
const AdminIncidents = lazy(() => import('./pages/admin/Incidents'));
const AdminReport    = lazy(() => import('./pages/admin/Report'));

// Manager
const ManagerLayout    = lazy(() => import('./pages/manager/ManagerLayout'));
const ManagerDashboard = lazy(() => import('./pages/manager/Dashboard'));
const ManagerTrips     = lazy(() => import('./pages/manager/Trips'));
const ManagerFleet     = lazy(() => import('./pages/manager/Fleet'));
const ManagerPayments  = lazy(() => import('./pages/manager/Payments'));

// Driver
const DriverLayout  = lazy(() => import('./pages/driver/DriverLayout'));
const DriverTrips   = lazy(() => import('./pages/driver/Trips'));
const DriverActive  = lazy(() => import('./pages/driver/ActiveTrip'));
const DriverHistory = lazy(() => import('./pages/driver/History'));

// Parent
const ParentLayout        = lazy(() => import('./pages/parent/ParentLayout'));
const ParentDashboard     = lazy(() => import('./pages/parent/Dashboard'));
const ParentTracking      = lazy(() => import('./pages/parent/Tracking'));
const ParentAttendance    = lazy(() => import('./pages/parent/Attendance'));
const ParentInvoices      = lazy(() => import('./pages/parent/Invoices'));
const ParentAbsent        = lazy(() => import('./pages/parent/AbsentRequest'));
const ParentNotifications = lazy(() => import('./pages/parent/Notifications'));

// Student
const StudentLayout  = lazy(() => import('./pages/student/StudentLayout'));
const StudentHome    = lazy(() => import('./pages/student/Home'));
const StudentBus     = lazy(() => import('./pages/student/BusTracker'));

// ── Guards ───────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Đang tải...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user)   return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  const map = { admin:'/admin', manager:'/manager', driver:'/driver', parent:'/parent', student:'/student' };
  return <Navigate to={map[user?.role] || '/login'} replace />;
};

// ── Routes ───────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot"   element={<ForgotPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index          element={<AdminDashboard />} />
          <Route path="users"    element={<AdminUsers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="routes"   element={<AdminRoutes />} />
          <Route path="incidents"element={<AdminIncidents />} />
          <Route path="reports"  element={<AdminReport />} />
        </Route>

        {/* Manager */}
        <Route path="/manager" element={<ProtectedRoute roles={['manager','admin']}><ManagerLayout /></ProtectedRoute>}>
          <Route index          element={<ManagerDashboard />} />
          <Route path="trips"    element={<ManagerTrips />} />
          <Route path="fleet"    element={<ManagerFleet />} />
          <Route path="payments" element={<ManagerPayments />} />
        </Route>

        {/* Driver */}
        <Route path="/driver" element={<ProtectedRoute roles={['driver']}><DriverLayout /></ProtectedRoute>}>
          <Route index         element={<DriverTrips />} />
          <Route path="active" element={<DriverActive />} />
          <Route path="history"element={<DriverHistory />} />
        </Route>

        {/* Parent */}
        <Route path="/parent" element={<ProtectedRoute roles={['parent']}><ParentLayout /></ProtectedRoute>}>
          <Route index                element={<ParentDashboard />} />
          <Route path="tracking"      element={<ParentTracking />} />
          <Route path="attendance"    element={<ParentAttendance />} />
          <Route path="invoices"      element={<ParentInvoices />} />
          <Route path="absent"        element={<ParentAbsent />} />
          <Route path="notifications" element={<ParentNotifications />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>}>
          <Route index     element={<StudentHome />} />
          <Route path="bus"element={<StudentBus />} />
        </Route>

        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-500 mb-2">403</h1>
              <p className="text-gray-600">Bạn không có quyền truy cập trang này</p>
              <a href="/login" className="text-primary-600 hover:underline text-sm mt-2 inline-block">← Về trang đăng nhập</a>
            </div>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius:'10px', background:'#333', color:'#fff' } }} />
        <AppRoutes />
      </SocketProvider>
    </AuthProvider>
  );
}
