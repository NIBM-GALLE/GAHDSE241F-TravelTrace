import { useState } from 'react';
import { 
  Calendar, Filter, AlertTriangle, BarChart2, 
  MoreVertical, Settings, Monitor, Smartphone, Globe
} from 'lucide-react';

const mockLogs = [
  {
    id: 1,
    timestamp: 'Oct 31, 2023',
    time: '14:22:05.122',
    user: 'Alex Rivera',
    role: 'Super Admin',
    initials: 'AR',
    action: 'Failed Login Attempt',
    actionType: 'error',
    ip: '192.168.1.104',
    device: 'Chrome / macOS',
    deviceType: 'desktop'
  },
  {
    id: 2,
    timestamp: 'Oct 31, 2023',
    time: '13:45:12.890',
    user: 'Sarah Chen',
    role: 'Trip Coordinator',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    action: "Updated Destination: 'Kyoto'",
    actionType: 'info',
    ip: '45.22.190.12',
    device: 'Safari / iOS',
    deviceType: 'mobile'
  },
  {
    id: 3,
    timestamp: 'Oct 31, 2023',
    time: '12:10:01.005',
    user: 'System Kernel',
    role: 'Automated Task',
    icon: Settings,
    action: 'Database Indexing Delayed',
    actionType: 'warning',
    ip: 'Internal Network',
    device: 'AWS-US-EAST-1',
    deviceType: 'server'
  },
  {
    id: 4,
    timestamp: 'Oct 31, 2023',
    time: '11:30:22.441',
    user: 'Marcus Wright',
    role: 'Finance Lead',
    initials: 'MW',
    action: 'Exported Q3 Expense Report',
    actionType: 'neutral',
    ip: '203.44.11.89',
    device: 'Firefox / Windows',
    deviceType: 'desktop'
  }
];

export default function ActivityLogs() {
  const [severityFilter, setSeverityFilter] = useState('All');

  const getActionDot = (type: string) => {
    switch(type) {
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch(type) {
      case 'desktop': return <Monitor size={16} className="text-slate-500" />;
      case 'mobile': return <Smartphone size={16} className="text-slate-500" />;
      case 'server': return <Globe size={16} className="text-slate-500" />;
      default: return <Monitor size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px w-8 bg-blue-600"></div>
            <h1 className="text-sm font-bold text-blue-600 tracking-wider uppercase">System Monitoring</h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Activity Logs</h2>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            Real-time audit trail of all administrative actions, system events, and security-critical operations across the TravelTrace platform.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 flex flex-col items-center justify-center min-w-[140px]">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Critical Errors</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-rose-600">12</span>
              <AlertTriangle size={20} className="text-rose-500" />
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-w-[140px]">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Total Events</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-800">2.4k</span>
              <BarChart2 size={20} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-xs font-medium text-slate-500 ml-1">Date Range</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              defaultValue="Oct 24, 2023 - Oct 31, 2023"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-xs font-medium text-slate-500 ml-1">Actor Type</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 appearance-none">
            <option>All Actors</option>
            <option>Super Admins</option>
            <option>System Tasks</option>
          </select>
        </div>

        <div className="flex-1 w-full space-y-1.5">
          <label className="text-xs font-medium text-slate-500 ml-1">Severity</label>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            {['All', 'Info', 'Error'].map(tab => (
              <button
                key={tab}
                onClick={() => setSeverityFilter(tab)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  severityFilter === tab 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Filter size={18} />
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">User / Actor</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Device Info</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-800 text-sm">{log.timestamp}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">{log.time}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {log.avatar ? (
                        <img src={log.avatar} alt={log.user} className="w-10 h-10 rounded-full object-cover" />
                      ) : log.icon ? (
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <log.icon size={20} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                          {log.initials}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{log.user}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{log.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getActionDot(log.actionType)}`}></div>
                      <p className={`text-sm font-medium ${log.actionType === 'error' ? 'text-slate-800' : 'text-slate-600'}`}>
                        {log.action}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-slate-600 font-mono text-xs">{log.ip}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      {getDeviceIcon(log.deviceType)}
                      <p className="text-sm">{log.device}</p>
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
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <p>Showing <span className="font-semibold text-slate-700">1 - 4</span> of 2,481 events</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded hover:bg-slate-100 text-slate-400">&lt;&lt;</button>
            <button className="px-3 py-1 rounded hover:bg-slate-100 text-slate-400">&lt;</button>
            <button className="px-3 py-1 rounded bg-blue-600 text-white font-medium">1</button>
            <button className="px-3 py-1 rounded hover:bg-slate-100">2</button>
            <button className="px-3 py-1 rounded hover:bg-slate-100">3</button>
            <span className="px-2">...</span>
            <button className="px-3 py-1 rounded hover:bg-slate-100">620</button>
            <button className="px-3 py-1 rounded hover:bg-slate-100 text-slate-600">&gt;</button>
            <button className="px-3 py-1 rounded hover:bg-slate-100 text-slate-600">&gt;&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
