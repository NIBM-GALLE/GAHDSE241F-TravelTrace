import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import '../../admin.css';
import {
  LayoutDashboard, Map, Activity, Users, Settings, LogOut, Menu,
  MapPin, Compass, Tags, BarChart3, Bell, MessageSquare,
  LifeBuoy, ShieldCheck, UserCog, User, Search, ChevronDown
} from 'lucide-react';

// ── Sidebar nav structure with category labels ──────────────
const navSections = [
  {
    label: null,
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { name: 'User Management', path: '/admin/dashboard/users', icon: Users },
      { name: 'Trip Management', path: '/admin/dashboard/trails', icon: Map },
      { name: 'Location Tracking', path: '#location-tracking', icon: MapPin },
      { name: 'Destinations', path: '#destinations', icon: Compass },
      { name: 'Categories', path: '#categories', icon: Tags },
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { name: 'Reports & Analytics', path: '#reports', icon: BarChart3 },
      { name: 'Activity Logs', path: '/admin/dashboard/activity-logs', icon: Activity },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { name: 'Notifications', path: '#notifications', icon: Bell },
      { name: 'Feedback', path: '#feedback', icon: MessageSquare },
      { name: 'Support Center', path: '#support', icon: LifeBuoy },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Admin Management', path: '#admin-mgmt', icon: ShieldCheck },
      { name: 'Roles & Permissions', path: '#roles', icon: UserCog },
      { name: 'Settings', path: '/admin/dashboard/settings', icon: Settings },
      { name: 'Profile', path: '#profile', icon: User },
    ],
  },
];

export default function AdminLayout() {
  const { isAdmin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/admin', { replace: true });
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-slate-200
        flex flex-col z-50 transition-transform duration-300 admin-scroll overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-600/20">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h2 className="text-slate-800 font-bold text-lg leading-tight tracking-tight">
              Travel<span className="text-blue-600">Trace</span>
            </h2>
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-3 py-4 space-y-5">
          {navSections.map((section, si) => (
            <div key={si}>
              {section.label && (
                <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isHash = item.path.startsWith('#');
                  const isActive = !isHash && (
                    item.path === '/admin/dashboard'
                      ? location.pathname === '/admin/dashboard'
                      : location.pathname.startsWith(item.path)
                  );

                  if (isHash) {
                    return (
                      <button
                        key={item.path}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-default opacity-60"
                        disabled
                      >
                        <item.icon className="w-[18px] h-[18px]" />
                        {item.name}
                      </button>
                    );
                  }

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/admin/dashboard'}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-[18px] h-[18px]" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin profile / logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">AR</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-800 text-sm font-semibold truncate">Alex Rivera</p>
              <p className="text-slate-400 text-xs truncate">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-xl relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search travel data..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex-1 md:hidden" />

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              {/* Admin avatar */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AR</span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-slate-700 leading-tight">Alex Rivera</p>
                  <p className="text-xs text-slate-400">Super Admin</p>
                </div>
                <ChevronDown className="hidden lg:block w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
