import { 
  Users, Plane, Compass, MapPin, 
  UserPlus, Ticket, BarChart3, ChevronRight,
  AlertTriangle, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const chartData = [
  { name: 'Jan', newUsers: 1200, conversion: 800 },
  { name: 'Feb', newUsers: 1800, conversion: 1000 },
  { name: 'Mar', newUsers: 1400, conversion: 1200 },
  { name: 'Apr', newUsers: 2400, conversion: 1600 },
  { name: 'May', newUsers: 2200, conversion: 1800 },
  { name: 'Jun', newUsers: 1500, conversion: 1300 },
  { name: 'Jul', newUsers: 3000, conversion: 2200 }
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TOTAL USERS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Users</p>
               <p className="text-3xl font-normal text-slate-700">12,480</p>
             </div>
             <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
               <Users size={20} />
             </div>
           </div>
           <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
             <TrendingIcon type="up" color="text-blue-600" />
             <span className="text-blue-600">+12.5%</span> vs last month
           </p>
        </div>

        {/* TOTAL TRIPS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Trips</p>
               <p className="text-3xl font-normal text-slate-700">3,521</p>
             </div>
             <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
               <Plane size={20} />
             </div>
           </div>
           <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
             <TrendingIcon type="up" color="text-orange-600" />
             <span className="text-orange-600">+8.2%</span> vs last month
           </p>
        </div>

        {/* ACTIVE TRIPS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Trips</p>
               <p className="text-3xl font-normal text-slate-700">842</p>
             </div>
             <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
               <Compass size={20} />
             </div>
           </div>
           <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
             <TrendingIcon type="down" color="text-red-600" />
             <span className="text-red-600">-2.4%</span> live tracking
           </p>
        </div>

        {/* ACTIVE TRAVELERS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Travelers</p>
               <p className="text-3xl font-normal text-slate-700">1,290</p>
             </div>
             <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
               <MapPin size={20} />
             </div>
           </div>
           <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
             <Users size={14} className="text-slate-700 mr-0.5" />
             <span className="text-blue-600">1.2k</span> across 42 countries
           </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Chart Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Monthly Engagement</h3>
                <p className="text-sm text-slate-500">Global trip volume and user interaction metrics</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button className="px-4 py-1.5 text-sm font-medium bg-white text-blue-600 shadow-sm rounded-lg">Daily</button>
                <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">Monthly</button>
              </div>
            </div>
            
            <div className="h-64 w-full relative">
               {/* Custom lines to match screenshot */}
               <div className="absolute inset-x-0 top-1/4 border-b border-slate-100"></div>
               <div className="absolute inset-x-0 top-2/4 border-b border-slate-100"></div>
               <div className="absolute inset-x-0 top-3/4 border-b border-slate-100"></div>
               <div className="absolute inset-x-0 bottom-0 border-b border-slate-200"></div>
               
               {/* The chart */}
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="newUsers" 
                     stroke="#2563eb" 
                     strokeWidth={3} 
                     fill="url(#colorUsers)" 
                     activeDot={{ r: 6, strokeWidth: 2, stroke: '#2563eb', fill: '#fff' }}
                     dot={{ r: 4, strokeWidth: 2, stroke: '#2563eb', fill: '#fff' }}
                   />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
          
          {/* Chart Legend */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
             <h3 className="text-sm font-bold text-slate-700">Growth Analytics</h3>
             <div className="flex gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                   <span className="text-sm text-slate-600">New Users</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                   <span className="text-sm text-slate-600">Booking Conversion</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0">
          {/* Action Buttons */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl flex items-center justify-between transition-colors shadow-sm">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/50 rounded-lg">
                   <UserPlus size={20} className="text-white" />
                </div>
                <span className="font-bold tracking-wider text-sm uppercase">Add New User</span>
             </div>
             <ChevronRight size={20} />
          </button>
          
          <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 p-5 rounded-2xl flex items-center justify-between transition-colors shadow-sm">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-300 rounded-lg">
                   <Ticket size={20} className="text-slate-600" />
                </div>
                <span className="font-bold tracking-wider text-sm uppercase">Book New Trip</span>
             </div>
             <ChevronRight size={20} className="text-slate-500" />
          </button>
          
          <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 p-5 rounded-2xl flex items-center justify-between transition-colors shadow-sm">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-300 rounded-lg text-amber-700">
                   <BarChart3 size={20} className="text-slate-600" />
                </div>
                <span className="font-bold tracking-wider text-sm uppercase">Generate Report</span>
             </div>
             <ChevronRight size={20} className="text-slate-500" />
          </button>

          {/* Recent Alerts */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 mt-2">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-800 text-sm">Recent Alerts</h3>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
             </div>
             
             <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                {/* Alert 1 */}
                <div className="relative flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 z-10">
                      <AlertTriangle size={18} className="text-red-600" />
                   </div>
                   <div className="relative flex-1 bg-white pt-1">
                      <div className="absolute -left-[54px] top-12 w-2 h-2 rounded-full bg-red-600 z-10 border-2 border-white"></div>
                      <h4 className="text-sm font-semibold text-slate-800 leading-tight">Flight Cancellation: AF291</h4>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">Paris to New York - 1...</p>
                      <p className="text-xs text-slate-400 mt-2">2 mins ago</p>
                   </div>
                </div>
                
                {/* Alert 2 */}
                <div className="relative flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
                      <CheckCircle2 size={18} className="text-blue-600" />
                   </div>
                   <div className="flex-1 bg-white pt-1">
                      <h4 className="text-sm font-semibold text-slate-800 leading-tight">System Update Complete</h4>
                      <p className="text-sm text-slate-500 mt-1">V2.4 Cloud...</p>
                      <p className="text-xs text-slate-400 mt-2">45 mins ago</p>
                   </div>
                </div>

                {/* Alert 3 */}
                <div className="relative flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
                      <UserPlus size={18} className="text-blue-600" />
                   </div>
                   <div className="flex-1 bg-white pt-1">
                      <h4 className="text-sm font-semibold text-slate-800 leading-tight">New Partner Integration</h4>
                      <p className="text-sm text-slate-500 mt-1">HotelChain Global AP...</p>
                      <p className="text-xs text-slate-400 mt-2">2 hours ago</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendingIcon({ type, color }: { type: 'up' | 'down', color: string }) {
  if (type === 'up') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`w-3 h-3 ${color}`}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`w-3 h-3 ${color}`}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
  );
}
