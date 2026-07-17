import { Shield, Save, Users, Plane, Settings as SettingsIcon, Info } from 'lucide-react';

export default function RolesPermissions() {
  return (
    <div className="max-w-[1200px] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-sm font-bold text-slate-600 tracking-wider uppercase mb-1">Access Control</h1>
          <h2 className="text-2xl font-bold text-slate-800">Roles</h2>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg shadow-sm transition-colors text-sm">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col space-y-1">
          {/* SYSTEM LEVEL */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">System Level</p>
            <div className="bg-slate-100/80 border-l-4 border-slate-400 p-4 rounded-r-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-800">Super Admin</h3>
                <Shield size={18} className="text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Full unrestricted access to all system modules, billing, and server settings.
              </p>
              <p className="text-xs font-semibold text-slate-600">4 Users Assigned</p>
            </div>
          </div>

          {/* OPERATIONAL */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Operational</p>
            <div className="p-4 rounded-xl cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-700 group-hover:text-slate-800">Travel Coordinator</h3>
                <Plane size={18} className="text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Manage trip logistics, bookings, and user assignments without system-wide setting...
              </p>
              <p className="text-xs font-semibold text-slate-500">12 Users Assigned</p>
            </div>
          </div>

          {/* INTELLIGENCE */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Intelligence</p>
            <div className="p-4 rounded-xl cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-700 group-hover:text-slate-800">Data Analyst</h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-slate-400"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Read-only access to trips and users with full reporting and export capabilities.
              </p>
              <p className="text-xs font-semibold text-slate-500">3 Users Assigned</p>
            </div>
          </div>

          <div className="mt-auto pt-6 px-3">
            <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">Changes to roles are applied instantly to all assigned users.</p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col overflow-y-auto">
          <div className="mb-6 pb-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Super Admin Permissions</h2>
            <p className="text-sm text-slate-500">Granular control over module access and system actions.</p>
          </div>

          <div className="space-y-8 flex-1">
            {/* User Management */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-slate-700" />
                <h3 className="font-bold text-slate-800">User Management</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                  <h4 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-blue-700">Create & Edit Users</h4>
                  <p className="text-xs text-slate-500">Add new team members and update profiles.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                  <h4 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-blue-700">Delete Users</h4>
                  <p className="text-xs text-slate-500">Permanently remove users from the workspace.</p>
                </div>
              </div>
            </div>

            {/* Trip Operations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane size={18} className="text-slate-700" />
                <h3 className="font-bold text-slate-800">Trip Operations</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                  <h4 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-blue-700">Approve Bookings</h4>
                  <p className="text-xs text-slate-500">Finalize itineraries and confirm costs.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                  <h4 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-blue-700">Oversee Tracking</h4>
                  <p className="text-xs text-slate-500">Real-time GPS location of active travelers.</p>
                </div>
              </div>
            </div>

            {/* System Configuration */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SettingsIcon size={18} className="text-slate-700" />
                <h3 className="font-bold text-slate-800">System Configuration</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                  <h4 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-blue-700">Modify Roles</h4>
                  <p className="text-xs text-slate-500">Change existing role permissions or names.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                  <h4 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-blue-700">Billing & API</h4>
                  <p className="text-xs text-slate-500">Manage subscription and third-party integrations.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center flex flex-col items-center">
             <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                <Shield size={16} className="text-slate-500" />
             </div>
             <h4 className="font-semibold text-slate-700 text-sm mb-1">Audit Trail Active</h4>
             <p className="text-xs text-slate-500">All permission changes are logged for security compliance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
