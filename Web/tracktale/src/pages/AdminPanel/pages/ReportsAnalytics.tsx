import { useState } from 'react';
import { 
  Download, Calendar, TrendingUp, Users, MapPin, 
  ChevronDown
} from 'lucide-react';

export default function ReportsAnalytics() {
  return (
    <div className="space-y-8 max-w-[1200px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-1">Intelligence Engine</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Financial Analytics</h2>
          <p className="text-slate-500 text-sm max-w-2xl">
            Comprehensive performance metrics and fiscal health tracking for the 2023-2024 travel cycle.
          </p>
        </div>
        <div className="flex gap-2 text-sm text-slate-600 font-medium">
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            Export Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Download size={16} />
            Download CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL BOOKINGS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</p>
            <Calendar size={16} className="text-slate-300" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-3xl font-bold text-slate-800">12,450</p>
            <span className="text-sm font-semibold text-emerald-500 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              +12%
            </span>
          </div>
          <p className="text-xs text-slate-400">vs. 11,142 last period</p>
        </div>

        {/* AVG. TRIP COST */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Trip Cost</p>
            <div className="w-4 h-4 text-slate-300 flex items-center justify-center font-serif text-sm">$</div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-3xl font-bold text-slate-800">$2,840</p>
            <span className="text-sm font-semibold text-emerald-500 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              +4.2%
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <TrendingUp size={14} className="text-slate-400" /> Upward trend
          </div>
          <p className="text-xs text-slate-400 mt-1">Global average median</p>
        </div>

        {/* ACTIVE USERS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Users</p>
            <Users size={16} className="text-slate-300" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-3xl font-bold text-slate-800">4,290</p>
            <span className="text-sm font-semibold text-emerald-500 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              +85 new
            </span>
          </div>
          <div className="flex -space-x-2 mb-2 mt-1">
            <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">AR</div>
            <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">JB</div>
            <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">ML</div>
            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+12</div>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">98.2% retention rate</p>
        </div>

        {/* TOP DESTINATION */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Destination</p>
            <MapPin size={16} className="text-slate-300" />
          </div>
          <p className="text-xl font-bold text-slate-800 mb-1">Tokyo, JP</p>
          <p className="text-sm text-slate-600 mb-2">2,410 bookings</p>
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold mb-1">
             <TrendingUp size={14} /> Trending high (24%)
          </div>
          <p className="text-xs text-slate-400">Peak season: Oct - Dec</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-800">User Acquisition Growth</h3>
                <p className="text-xs text-slate-500">Historical data for the last 12 fiscal months</p>
              </div>
              <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800">
                Last 12 Months <ChevronDown size={16} />
              </button>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-64 relative border-b border-l border-slate-200 pb-2 pl-2">
               {/* Lines */}
               <div className="absolute inset-0 flex flex-col justify-between pb-2">
                 {[4,3,2,1].map(i => (
                    <div key={i} className="w-full border-t border-dashed border-slate-200 h-0"></div>
                 ))}
               </div>
               
               {/* Graph Path */}
               <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full text-blue-600 drop-shadow-md">
                 <path d="M0,35 L10,32 L20,34 L35,25 L50,28 L70,15 L100,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                 {/* Points */}
                 <circle cx="50" cy="28" r="1.5" fill="white" stroke="currentColor" strokeWidth="1" />
                 <circle cx="100" cy="8" r="1.5" fill="currentColor" stroke="white" strokeWidth="0.5" />
               </svg>
               
               {/* X Axis */}
               <div className="absolute -bottom-6 left-2 right-0 flex justify-between text-xs text-slate-400 font-medium">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                  <span>Dec</span>
               </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-end">
               <div>
                 <h3 className="font-bold text-slate-800 mb-1">Monthly Revenue Breakdown</h3>
                 <p className="text-xs text-slate-500 hidden sm:block">Aggregated monthly income and expenses.</p>
               </div>
               <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All Data</button>
            </div>
            
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Month</th>
                    <th className="pb-3 px-4">Revenue</th>
                    <th className="pb-3 px-4">Expenses</th>
                    <th className="pb-3 px-4">Margin</th>
                    <th className="pb-3 pl-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 pr-4 font-medium">December 2023</td>
                    <td className="py-3 px-4">$342,100</td>
                    <td className="py-3 px-4">$120,400</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">+64.8%</td>
                    <td className="py-3 pl-4 text-emerald-600 font-medium">High Performance</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">November 2023</td>
                    <td className="py-3 px-4">$298,450</td>
                    <td className="py-3 px-4">$115,200</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">+61.4%</td>
                    <td className="py-3 pl-4 text-slate-600 font-medium">Stable</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">October 2023</td>
                    <td className="py-3 px-4">$275,000</td>
                    <td className="py-3 px-4">$130,000</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">+52.7%</td>
                    <td className="py-3 pl-4 text-slate-600 font-medium">Average</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Charts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-1">Regional Share</h3>
            <p className="text-xs text-slate-500 mb-6">Market distribution by continent</p>
            
            <div className="flex justify-center mb-6">
              {/* Donut Chart */}
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#000000" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="0" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-slate-800">1.2M</p>
                  <p className="text-xs text-slate-500">Total Revenue</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-black"></div>
                  <span className="text-slate-600">Asia Pacific</span>
                </div>
                <span className="font-bold text-slate-800">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <span className="text-slate-600">Europe</span>
                </div>
                <span className="font-bold text-slate-800">30%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                  <span className="text-slate-600">North America</span>
                </div>
                <span className="font-bold text-slate-800">25%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
               <TrendingUp size={18} /> Growth Efficiency
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Our computational model predicts a 15% increase in efficiency across logistics partners in Q1.
            </p>
            
            <div className="flex justify-between items-end mt-6">
              <span className="text-xs font-semibold text-slate-500 uppercase">Efficiency Score</span>
              <span className="text-lg font-bold text-slate-800">9.4/10</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
               <div className="bg-emerald-500 h-full w-[94%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
