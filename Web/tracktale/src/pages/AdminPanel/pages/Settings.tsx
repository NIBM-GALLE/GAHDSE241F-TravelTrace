import { useState } from 'react';
import { 
  FileText, Terminal, Shield
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = ['General', 'Email & SMTP', 'Database', 'API Keys', 'Security'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">System Settings</h1>
        <p className="text-slate-500 max-w-3xl leading-relaxed">
          Configure global application parameters, security protocols, and integration endpoints for the TravelTrace ecosystem.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === tab 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Application Identity */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Application Identity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">App Name</label>
                <input 
                  type="text" 
                  defaultValue="TravelTrace Pro"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="ops@traveltrace.io"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-600">Organization Logo</label>
              <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-6 border border-slate-100">
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center font-bold text-blue-600">
                  TT
                </div>
                <div className="flex items-center gap-4">
                  <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                    Change Logo
                  </button>
                  <span className="text-xs text-slate-400 font-medium">SVG or PNG. Max 2MB.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Regional & Appearance */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Regional & Appearance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">System Language</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                  <option>English (US)</option>
                  <option>French (FR)</option>
                  <option>Spanish (ES)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Theme Mode</label>
                <div className="flex bg-slate-50 border border-slate-100 rounded-xl p-1 w-max">
                  <button className="bg-white text-blue-600 shadow-sm rounded-lg px-6 py-2 font-medium text-sm transition-all">
                    Light
                  </button>
                  <button className="text-slate-400 hover:text-slate-600 rounded-lg px-6 py-2 font-medium text-sm transition-all">
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-6 pt-4">
            <button className="text-slate-500 hover:text-slate-700 font-medium transition-colors">
              Discard Changes
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm shadow-blue-600/20">
              Save Configurations
            </button>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
          
          {/* Quick Resources */}
          <div className="bg-slate-100/50 rounded-2xl p-6 border border-slate-200/60">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Quick Resources</h4>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors group">
                <div className="bg-white p-2 rounded-lg border border-slate-200 group-hover:border-blue-200 group-hover:shadow-sm transition-all">
                  <FileText size={18} className="text-slate-400 group-hover:text-blue-500" />
                </div>
                <span className="font-medium text-sm">Setup Documentation</span>
              </button>
              <button className="w-full flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors group">
                <div className="bg-white p-2 rounded-lg border border-slate-200 group-hover:border-blue-200 group-hover:shadow-sm transition-all">
                  <Terminal size={18} className="text-slate-400 group-hover:text-blue-500" />
                </div>
                <span className="font-medium text-sm">CLI Access Guides</span>
              </button>
              <button className="w-full flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors group">
                <div className="bg-white p-2 rounded-lg border border-slate-200 group-hover:border-blue-200 group-hover:shadow-sm transition-all">
                  <Shield size={18} className="text-slate-400 group-hover:text-blue-500" />
                </div>
                <span className="font-medium text-sm">Privacy & Compliance</span>
              </button>
            </div>
          </div>

          {/* Tier Usage */}
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-6">Tier Usage</h4>
            
            <div className="space-y-5 mb-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">API Requests</span>
                  <span className="text-slate-800 font-semibold">842k / 1M</span>
                </div>
                <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[84%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Storage</span>
                  <span className="text-slate-800 font-semibold">12.4 GB / 20 GB</span>
                </div>
                <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-[62%]"></div>
                </div>
              </div>
            </div>

            <button className="w-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium py-2.5 rounded-xl transition-colors shadow-sm">
              Upgrade Subscription
            </button>
          </div>

          {/* Recent Changes */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Recent Changes</h4>
            <div className="relative pl-4 border-l-2 border-slate-200 space-y-6">
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-slate-50"></div>
                <p className="text-sm font-medium text-slate-800">SMTP settings updated</p>
                <p className="text-xs text-slate-500 mt-0.5">By Alex Rivera • 2h ago</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-slate-300 rounded-full"></div>
                <p className="text-sm font-medium text-slate-600">Database backup created</p>
                <p className="text-xs text-slate-400 mt-0.5">System • 5h ago</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
