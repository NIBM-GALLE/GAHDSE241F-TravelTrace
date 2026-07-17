import { useState } from 'react';
import { 
  Ticket, AlertCircle, Clock, Star, 
  Filter, UserPlus, Lock, Link as LinkIcon, 
  Paperclip, Bold, Italic, Send
} from 'lucide-react';

const tickets = [
  {
    id: '#TRX-9402',
    priority: 'High',
    title: 'Critical: API Booking Timeout',
    preview: 'System is returning 504 Gateway Timeout during the...',
    author: 'John Doe',
    initials: 'JD',
    time: '12m ago',
    active: true
  },
  {
    id: '#TRX-9398',
    priority: 'Medium',
    title: 'Login Loop on Mobile App',
    preview: 'Users on iOS v16.4 are reporting that they are redirected to the...',
    author: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    time: '2h ago',
    active: false
  },
  {
    id: '#TRX-9385',
    priority: 'Low',
    title: 'Invoice Branding Update',
    preview: 'Requested change for the PDF generation logo to the new 20...',
    author: 'Marcus Kane',
    initials: 'MK',
    time: '5h ago',
    active: false
  }
];

export default function SupportCenter() {
  return (
    <div className="space-y-6 max-w-[1200px] h-[calc(100vh-120px)] flex flex-col">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Tickets</p>
            <p className="text-2xl font-bold text-slate-800">1,284</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Ticket size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Urgent Priority</p>
            <p className="text-2xl font-bold text-slate-800">12</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avg. Response Time</p>
            <p className="text-2xl font-bold text-slate-800">1.4h</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Satisfaction</p>
            <p className="text-2xl font-bold text-slate-800">98%</p>
          </div>
          <div className="flex gap-1 text-orange-400">
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Panel - Ticket List */}
        <div className="w-full lg:w-[380px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex bg-slate-100 rounded-full p-1">
              <button className="px-5 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full shadow-sm">Open</button>
              <button className="px-5 py-1.5 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-full transition-colors">Closed</button>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100">
              <Filter size={18} />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className={`p-4 rounded-xl cursor-pointer border ${
                  ticket.active 
                    ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                    : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
                } transition-all`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-bold ${ticket.active ? 'text-blue-700' : 'text-slate-500'}`}>
                    {ticket.id}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    ticket.priority === 'High' 
                      ? 'bg-red-100 text-red-600'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{ticket.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {ticket.preview}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {ticket.avatar ? (
                      <img src={ticket.avatar} alt={ticket.author} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {ticket.initials}
                      </div>
                    )}
                    <span className="text-xs font-medium text-slate-600">{ticket.author}</span>
                  </div>
                  <span className="text-xs text-slate-400">{ticket.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Ticket Detail */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-w-0">
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">IN PROGRESS</span>
                <span className="text-sm text-slate-500">Opened Oct 24, 2023 at 09:12 AM</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Critical: API Booking Timeout</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200">
                <UserPlus size={16} />
                Assign Agent
                <ChevronDown size={14} className="ml-1" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                <Lock size={16} />
                Close Ticket
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {/* Chat Bubble */}
            <div className="flex gap-4 max-w-2xl">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-sm font-bold text-slate-600 mt-1">
                JD
              </div>
              <div className="flex-1 space-y-2">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                  <div className="bg-slate-900 rounded-xl p-4 mb-3 flex items-center justify-center relative overflow-hidden">
                    {/* Fake Error Image */}
                    <div className="w-full max-w-[400px] h-32 bg-slate-800 rounded flex flex-col relative border border-slate-700 overflow-hidden opacity-90">
                       <div className="h-6 bg-slate-950 flex items-center px-2 gap-1.5 border-b border-slate-700">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                       </div>
                       <div className="p-3 text-red-400 font-mono text-xs flex flex-col items-center justify-center h-full">
                          <AlertCircle size={24} className="mb-2" />
                          <p>Error: 504 Gateway Timeout</p>
                       </div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Attached the screenshot of the stack trace seen on the client side.
                  </p>
                </div>
                <div className="text-xs text-slate-500 font-medium ml-1">
                  John Doe • 09:40 AM
                </div>
              </div>
            </div>
          </div>

          {/* Reply Editor */}
          <div className="p-4 border-t border-slate-200">
            <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white">
              {/* Toolbar */}
              <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50">
                <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"><Bold size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"><Italic size={16} /></button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"><LinkIcon size={16} /></button>
                <div className="flex-1"></div>
                <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"><Paperclip size={16} /></button>
              </div>
              
              <textarea 
                className="w-full p-4 text-sm text-slate-700 placeholder-slate-400 outline-none resize-none"
                rows={3}
                placeholder="Type your reply here..."
              ></textarea>
              
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-slate-400 bg-white"></div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">Internal Note</span>
                </label>
                <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                  Send Reply
                  <Send size={14} className="ml-1" />
                </button>
              </div>
            </div>
            
            <div className="absolute right-4 bottom-4 text-[10px] font-bold text-slate-300 vertical-text origin-bottom-right transform rotate-90">
               SUPPORT CENTER VER 2.4.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this inline style component to support the vertical text seen in the screenshot
// You can also add it to a global css file
const styles = `
  .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
`;
