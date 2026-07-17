import { useState } from 'react';
import { 
  Video, Share2, Filter, Target, Search,
  Map as MapIcon, Download
} from 'lucide-react';

export default function LocationTracking() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] -m-4 lg:-m-8 bg-[#f8fafc] relative overflow-hidden">
      {/* Background Map Placeholder */}
      <div className="absolute inset-0 bg-[#e2e8f0] opacity-30 pointer-events-none">
         {/* A simple placeholder pattern to suggest a map */}
         <div className="w-full h-full" style={{
           backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
           backgroundSize: '24px 24px'
         }}></div>
      </div>
      
      {/* Map pin icon center */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-300">
         <MapIcon size={24} />
      </div>

      <div className="flex flex-1 min-h-0 relative z-10">
        {/* Main tracking view area */}
        <div className="flex-1 relative p-6 pointer-events-none">
          {/* Overlay Info Card */}
          <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-slate-200/60 w-80 pointer-events-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm tracking-widest uppercase mb-1">Live Tracking</h3>
                <p className="text-slate-800 font-semibold">Elena Rodriguez</p>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase">Active</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Coordinates</p>
                <p className="text-sm font-mono text-slate-700">51.5074° N<br/>0.1278° W</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Speed</p>
                <p className="text-sm font-medium text-slate-700">4.2 km/h</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Battery</p>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <div className="w-3 h-5 border border-slate-400 rounded-sm p-[1px] flex flex-col justify-end">
                    <div className="bg-slate-700 w-full h-[82%] rounded-sm"></div>
                  </div>
                  82%
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Altitude</p>
                <p className="text-sm font-medium text-slate-700">14 m</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl shadow-sm transition-colors">
                <Video size={16} />
                Connect Video
              </button>
              <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors border border-slate-200">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[320px] lg:w-[380px] bg-white border-l border-slate-200 flex flex-col flex-shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] pointer-events-auto">
          {/* Search Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search active travelers..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Active List */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Now (14)</h3>
                <button className="text-slate-400 hover:text-slate-600">
                  <Filter size={16} />
                </button>
              </div>
              
              <div className="space-y-1">
                {/* User 1 */}
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                  <div className="relative">
                    <img src="https://i.pravatar.cc/150?u=marcus" alt="Marcus" className="w-10 h-10 rounded-full object-cover" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800">Marcus Chen</h4>
                    <p className="text-xs text-slate-500 truncate">Berlin, Germany</p>
                  </div>
                </div>

                {/* User 2 - Selected */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer transition-colors relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 rounded-l-xl"></div>
                  <div className="relative">
                    <img src="https://i.pravatar.cc/150?u=elena" alt="Elena" className="w-10 h-10 rounded-full object-cover ring-2 ring-white ring-offset-1 ring-offset-slate-100" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-100 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800">Elena Rodriguez</h4>
                    <p className="text-xs text-slate-600 truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> London, UK • Near Big Ben
                    </p>
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-slate-800 bg-white rounded-lg shadow-sm border border-slate-200 mr-1">
                    <Target size={16} />
                  </button>
                </div>

                {/* User 3 */}
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                  <div className="relative">
                    <img src="https://i.pravatar.cc/150?u=julian" alt="Julian" className="w-10 h-10 rounded-full object-cover" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800">Julian Voss</h4>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Zurich, Switzerland
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Route History */}
            <div className="p-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Route History</h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pl-6">
                
                {/* Timeline Item 1 */}
                <div className="relative">
                  <div className="absolute -left-6 w-3 h-3 bg-white border-2 border-blue-500 rounded-full mt-1 z-10 shadow-[0_0_0_4px_white]"></div>
                  <div className="absolute -left-[23px] top-[14px] bottom-[-22px] w-px bg-blue-200"></div>
                  <p className="text-xs font-bold text-slate-800 mb-0.5">14:32 PM</p>
                  <p className="text-sm font-bold text-slate-800">Trafalgar Square</p>
                  <p className="text-xs text-slate-500 mt-0.5">Arrival at waypoint</p>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative">
                  <div className="absolute -left-6 w-3 h-3 bg-white border-2 border-slate-300 rounded-full mt-1 z-10 shadow-[0_0_0_4px_white]"></div>
                  <div className="absolute -left-[23px] top-[14px] bottom-[-22px] w-px bg-slate-200"></div>
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">13:15 PM</p>
                  <p className="text-sm font-medium text-slate-400">London Eye</p>
                  <p className="text-xs text-slate-400 mt-0.5">Check-in confirmed</p>
                </div>

                {/* Timeline Item 3 */}
                <div className="relative">
                  <div className="absolute -left-6 w-3 h-3 bg-white border-2 border-slate-200 rounded-full mt-1 z-10 shadow-[0_0_0_4px_white]"></div>
                  <p className="text-xs font-semibold text-slate-300 mb-0.5">11:45 AM</p>
                  <p className="text-sm font-medium text-slate-300">Waterloo Station</p>
                  <p className="text-xs text-slate-300 mt-0.5">Transit connection</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-12 bg-white border-t border-slate-200 flex items-center justify-between px-6 z-20 pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uplink Status</span>
            <div className="flex gap-0.5">
               <div className="w-1.5 h-3 bg-emerald-500 rounded-sm"></div>
               <div className="w-1.5 h-3 bg-emerald-500 rounded-sm"></div>
               <div className="w-1.5 h-3 bg-emerald-500 rounded-sm"></div>
               <div className="w-1.5 h-3 bg-emerald-500/30 rounded-sm"></div>
            </div>
            <span className="text-xs font-bold text-slate-800">STABLE (98ms)</span>
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
             <AlertCircle size={14} className="text-slate-400" />
             No alerts in selected region
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5">
             <MapIcon size={16} /> Map
          </button>
          <button className="text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5">
             <Download size={16} /> Export Log
          </button>
        </div>
      </div>
    </div>
  );
}
