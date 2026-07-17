// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import TrailDetail from './pages/TrailDetail';
import About from './pages/About';
import Support from './pages/Support';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminPanel/AdminLayout';
import Dashboard from './pages/AdminPanel/pages/Dashboard';
import UserManagement from './pages/AdminPanel/pages/UserManagement';
import ActivityLogs from './pages/AdminPanel/pages/ActivityLogs';
import ManageTrails from './pages/AdminPanel/pages/ManageTrails';
import Settings from './pages/AdminPanel/pages/Settings';
import AdminManagement from './pages/AdminPanel/pages/AdminManagement';
import RolesPermissions from './pages/AdminPanel/pages/RolesPermissions';
import ReportsAnalytics from './pages/AdminPanel/pages/ReportsAnalytics';
import SupportCenter from './pages/AdminPanel/pages/SupportCenter';
import LocationTracking from './pages/AdminPanel/pages/LocationTracking';
import Destinations from './pages/AdminPanel/pages/Destinations';
import Categories from './pages/AdminPanel/pages/Categories';
import Feedback from './pages/AdminPanel/pages/Feedback';
import Profile from './pages/AdminPanel/pages/Profile';
import Notifications from './pages/AdminPanel/pages/Notifications';

// ── Protected route for admin dashboard ──────────────────────
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdminAuth();
  if (!isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

// ── Layout wrapper — hides Navbar/Footer on admin pages ──────
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={isAdminRoute ? '' : 'flex flex-col min-h-screen bg-slate-950'}>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'flex-1'}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trail/:id" element={<TrailDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<Dashboard />} />
            <Route path="trails" element={<ManageTrails />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="activity-logs" element={<ActivityLogs />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin-management" element={<AdminManagement />} />
            <Route path="roles" element={<RolesPermissions />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="support" element={<SupportCenter />} />
            <Route path="location-tracking" element={<LocationTracking />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="categories" element={<Categories />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Routes>
      </main>
      {/* Don't show footer on trail detail (full-screen map) or admin routes */}
      {!isAdminRoute && (
        <Routes>
          <Route path="/trail/:id" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AppLayout />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
