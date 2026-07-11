import { useState } from 'react';
import { 
  Users, Search, Filter, Download, MoreVertical
} from 'lucide-react';

const mockUsers = [
  {
    id: 'TRV-8821',
    name: 'Elena Rodriguez',
    email: 'elena.r@voyagecorp.com',
    phone: '+1 (555) 012-4455',
    date: 'Oct 12, 2023',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: 'TRV-9042',
    name: 'Marcus Chen',
    email: 'm.chen@designhub.io',
    phone: '+44 20 7946 0123',
    date: 'Nov 05, 2023',
    role: 'Manager',
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: 'TRV-1102',
    name: 'Jameson Blake',
    email: 'j.blake@globalcorp.net',
    phone: '+1 (555) 998-0021',
    date: 'Jan 18, 2024',
    role: 'Traveler',
    status: 'Suspended',
    avatar: 'https://i.pravatar.cc/150?u=3'
  },
  {
    id: 'TRV-7731',
    name: 'Amara Okafor',
    email: 'amara.o@techflow.io',
    phone: '+234 803 123 4567',
    date: 'Feb 02, 2024',
    role: 'Traveler',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=4'
  }
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Active</span>;
      case 'Pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Pending</span>;
      case 'Suspended':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>Suspended</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase text-blue-600 mb-1 text-sm tracking-wider">System Administration</h1>
          <h2 className="text-xl font-semibold text-slate-800">User Management</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Manage platform access, monitor registration trends, and adjust administrative privileges across your global travel network.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[120px]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
            <p className="text-2xl font-bold text-blue-600">1284</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[120px]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Now</p>
            <p className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>42
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm shadow-blue-200">
          <Users size={18} />
          Add New User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            All Roles <Filter size={16} />
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            All Statuses <Filter size={16} />
          </button>
          <button className="flex-none flex items-center justify-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Registration</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        {user.status === 'Active' && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-slate-600">{user.email}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{user.phone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-slate-600">{user.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-100">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
