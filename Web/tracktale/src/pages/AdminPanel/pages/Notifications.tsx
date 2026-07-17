import { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle2, Settings } from 'lucide-react';

const initialNotifications = [
  { id: 1, type: 'alert', title: 'System Load High', message: 'CPU usage exceeded 90% for the last 5 minutes.', time: '10 mins ago', read: false },
  { id: 2, type: 'info', title: 'New Admin Added', message: 'Jordan Chen was added as an Editor.', time: '2 hours ago', read: false },
  { id: 3, type: 'success', title: 'Backup Complete', message: 'Database backup completed successfully.', time: 'Yesterday', read: true },
  { id: 4, type: 'alert', title: 'API Rate Limit Reached', message: 'Third-party flight API rate limit reached.', time: 'Yesterday', read: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={20} className="text-red-500" />;
      case 'info': return <Info size={20} className="text-blue-500" />;
      case 'success': return <CheckCircle2 size={20} className="text-emerald-500" />;
      default: return <Bell size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-1">Communication</h1>
          <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
          <p className="text-slate-500 text-sm mt-1">Review system alerts, operational messages, and account updates.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
           <h3 className="font-semibold text-slate-800 text-sm">Recent Alerts</h3>
           <Settings size={18} className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
        </div>
        <div className="divide-y divide-slate-100">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-5 flex gap-4 transition-colors hover:bg-slate-50 ${!notif.read ? 'bg-blue-50/30' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notif.read ? 'bg-white shadow-sm border border-slate-100' : 'bg-slate-100'}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm ${!notif.read ? 'font-bold text-slate-800' : 'font-medium text-slate-700'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{notif.time}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{notif.message}</p>
              </div>
              {!notif.read && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
           <Settings size={18} className="text-slate-400" />
           Notification Preferences
        </h3>
        <div className="space-y-4">
           <div className="flex items-center justify-between py-2 border-b border-slate-100">
             <div>
               <p className="text-sm font-medium text-slate-800">Email Alerts</p>
               <p className="text-xs text-slate-500">Receive critical system alerts via email</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" defaultChecked className="sr-only peer" />
               <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
             </label>
           </div>
           <div className="flex items-center justify-between py-2 border-b border-slate-100">
             <div>
               <p className="text-sm font-medium text-slate-800">Browser Push Notifications</p>
               <p className="text-xs text-slate-500">Get real-time alerts in your browser</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" className="sr-only peer" />
               <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
             </label>
           </div>
           <div className="flex items-center justify-between py-2">
             <div>
               <p className="text-sm font-medium text-slate-800">Weekly Summary</p>
               <p className="text-xs text-slate-500">Receive a weekly digest of all activities</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" defaultChecked className="sr-only peer" />
               <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
             </label>
           </div>
        </div>
      </div>
    </div>
  );
}
