import { useState } from 'react';
import { User, Mail, Shield, Key, Camera, Check } from 'lucide-react';

export default function Profile() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-1">System</h1>
          <h2 className="text-2xl font-bold text-slate-800">Admin Profile</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your personal account settings and security preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          {saved ? <Check size={18} /> : null}
          {saved ? 'Saved Successfully' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30">
                AR
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Alex Rivera</h3>
            <p className="text-sm text-slate-500 mb-4">Super Admin</p>
            <div className="w-full h-px bg-slate-100 mb-4"></div>
            <div className="w-full flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
            <div className="w-full flex justify-between text-sm mt-2">
              <span className="text-slate-500">Joined</span>
              <span className="font-semibold text-slate-800">Oct 2023</span>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
               <Shield size={16} className="text-blue-600" />
               Security Posture
            </h4>
            <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-600">2FA Enabled</span>
                 <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold uppercase">Yes</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-600">Last Password Change</span>
                 <span className="text-slate-800 font-medium text-xs">4 months ago</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User size={20} className="text-slate-400" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 ml-1">First Name</label>
                <input type="text" defaultValue="Alex" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 ml-1">Last Name</label>
                <input type="text" defaultValue="Rivera" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" defaultValue="alex.rivera@traveltrace.com" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Key size={20} className="text-slate-400" />
              Change Password
            </h3>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 ml-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 ml-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 ml-1">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
