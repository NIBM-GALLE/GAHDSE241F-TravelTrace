import { useState } from 'react';
import { 
  Shield, Activity, ShieldCheck, Clock, 
  Filter, Plus, MoreVertical, ChevronDown, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const admins = [
  {
    id: 1,
    name: 'Alex Rivera',
    joined: 'Joined Oct 2023',
    email: 'alex.rivera@traveltrace.com',
    role: 'Super Admin',
    lastLogin: '2 mins ago',
    status: 'Active',
    avatar: 'AR',
    avatarColor: 'bg-slate-800' // Using color or image
  },
  {
    id: 2,
    name: 'Jordan Chen',
    joined: 'Joined Jan 2024',
    email: 'j.chen@traveltrace.com',
    role: 'Editor',
    lastLogin: 'Yesterday, 4:15 PM',
    status: 'Active',
    avatar: 'JC',
    avatarColor: 'bg-slate-500'
  },
  {
    id: 3,
    name: 'Sarah Miller',
    joined: 'Joined Feb 2024',
    email: 's.miller@traveltrace.com',
    role: 'Viewer',
    lastLogin: 'Mar 12, 2024',
    status: 'Inactive',
    avatar: 'SM',
    avatarColor: 'bg-slate-400'
  },
  {
    id: 4,
    name: 'Devon Lane',
    joined: 'Joined Mar 2024',
    email: 'devon.lane@traveltrace.com',
    role: 'Editor',
    lastLogin: '2 hours ago',
    status: 'Suspended',
    avatar: 'DL',
    avatarColor: 'bg-slate-700'
  }
];

export default function AdminManagement() {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500';
      case 'Inactive': return 'bg-slate-400';
      case 'Suspended': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch(status) {
      case 'Active': return 'text-slate-700';
      case 'Inactive': return 'text-slate-500';
      case 'Suspended': return 'text-red-600';
      default: return 'text-slate-500';
    }
  };

  const getRoleStyle = (role: string) => {
    if (role === 'Super Admin') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="space-y-8 max-w-[1200px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="max-w-2xl">
          <h1 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-2">System Control</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin Management</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Manage system-level access, monitor administrative activity, and configure permission hierarchies for the TravelTrace ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors border border-slate-200">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors">
            <Plus size={18} />
            Add Admin
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Admins */}
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
              +2 this month
            </span>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Admins</p>
          <p className="text-2xl font-bold text-slate-800">24</p>
        </div>
        
        {/* Active Sessions */}
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Activity size={20} />
            </div>
            {/* Sparkline placeholder */}
            <div className="w-16 h-8 text-orange-400">
              <svg viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0,20 Q10,5 20,15 T40,25 T60,5 T80,20 T100,10" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Sessions</p>
          <p className="text-2xl font-bold text-slate-800">08</p>
        </div>

        {/* MFA Adoption */}
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">MFA Adoption</p>
          <p className="text-2xl font-bold text-slate-800">92%</p>
        </div>

        {/* Pending Requests */}
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Requests</p>
          <p className="text-2xl font-bold text-slate-800">03</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  Administrator <ChevronDown size={14} className="text-slate-400" />
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider">Last Login</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full ${admin.avatarColor} flex items-center justify-center text-white font-bold text-sm bg-cover bg-center`}
                             style={{backgroundImage: `url(https://i.pravatar.cc/150?u=${admin.id})`}}>
                        </div>
                        {admin.status === 'Active' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{admin.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{admin.joined}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-slate-600">{admin.email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleStyle(admin.role)}`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-slate-600">{admin.lastLogin}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(admin.status)}`}></div>
                      <p className={`text-sm font-medium ${getStatusTextColor(admin.status)}`}>
                        {admin.status}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <p>Showing <span className="font-semibold text-slate-700">1 to 4</span> of 24 administrators</p>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-slate-200 text-slate-400"><ChevronLeft size={16} /></button>
            <button className="w-7 h-7 rounded bg-blue-600 text-white font-medium flex items-center justify-center">1</button>
            <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">2</button>
            <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">3</button>
            <span className="px-1">...</span>
            <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">6</button>
            <button className="p-1 rounded hover:bg-slate-200 text-slate-600"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Role Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-2">Super Admin</h3>
          <p className="text-blue-100 text-sm leading-relaxed">
            Unrestricted access to all modules, system settings, and billing. Can manage other Super Admins.
          </p>
        </div>
        <div className="bg-slate-100 text-slate-800 p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="font-semibold mb-2">Editor</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Can manage trips, destinations, and user feedback. Limited access to system configurations.
          </p>
        </div>
        <div className="bg-slate-100 text-slate-800 p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="font-semibold mb-2">Viewer</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Read-only access to analytics and logs. Designed for audit and reporting purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
