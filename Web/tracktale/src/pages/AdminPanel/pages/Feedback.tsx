import { useState } from 'react';
import { 
  Star, ClipboardList, Download, ChevronDown, 
  MessageSquareReply, Trash2, CheckCircle2, Circle
} from 'lucide-react';

const feedbackData = [
  {
    id: 1,
    author: 'Elena Rodriguez',
    role: 'Trip to Kyoto',
    date: 'Oct 12, 2023',
    rating: 5,
    status: 'PENDING',
    text: '"The itinerary management was flawless. However, the integration with local rail passes in Japan could be more intuitive. I spent about 20 minutes trying to sync my Suica card. Oth...',
    avatar: 'https://i.pravatar.cc/150?u=elena'
  },
  {
    id: 2,
    author: 'Marcus Chen',
    role: 'Business Travel',
    date: 'Oct 10, 2023',
    rating: 4,
    status: 'RESOLVED',
    text: '"The real-time flight tracking saved my meeting in Berlin. My flight was delayed, but the app notified me before the airport screens did. Highly recommend for frequent fliers."',
    avatar: 'https://i.pravatar.cc/150?u=marcus'
  },
  {
    id: 3,
    author: 'Sarah Jenkins',
    role: 'Vacation',
    date: 'Oct 08, 2023',
    rating: 4,
    status: 'PENDING',
    text: '"The budget tracking features are excellent, but I would love to see more support for split-bill scenarios during group trips. It\'s a bit tedious to manually enter shared costs."',
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: 4,
    author: 'David Okafor',
    role: 'Explorer',
    date: 'Oct 05, 2023',
    rating: 5,
    status: 'RESOLVED',
    text: '"The offline mode works perfectly! I was trekking in the Atlas mountains and could still access all my saved maps and lodge information. This is a game changer for...',
    avatar: 'https://i.pravatar.cc/150?u=david'
  },
  {
    id: 5,
    author: 'Isabella Thorne',
    role: 'Global VP',
    date: 'Sep 29, 2023',
    rating: 5,
    status: 'RESOLVED',
    text: '"The enterprise reporting module is incredibly detailed. It helped our finance team identify $40k in annual travel savings within the first quarter of implementation."',
    avatar: 'https://i.pravatar.cc/150?u=isabella'
  }
];

export default function Feedback() {
  const [filter, setFilter] = useState('All');

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "text-slate-800 fill-slate-800" : "text-slate-300"} 
      />
    ));
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-1">Community Insights</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Feedback Management</h2>
          <p className="text-slate-500 text-sm max-w-2xl">
            Monitor and respond to global traveler experiences. High engagement correlates with a 14% increase in user retention.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[160px]">
            <div className="p-2 bg-slate-50 rounded-lg">
              <Star size={20} className="text-slate-800 fill-slate-800" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Avg. Rating</p>
              <p className="text-xl font-bold text-slate-800">4.82</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[160px]">
            <div className="p-2 bg-slate-50 rounded-lg">
              <ClipboardList size={20} className="text-slate-800" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Pending</p>
              <p className="text-xl font-bold text-slate-800">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <button className="text-sm font-medium text-slate-700 flex items-center gap-1 hover:text-slate-900">
              Newest First <ChevronDown size={14} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            {['All', 'Positive', 'Critical'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm font-medium ${filter === f ? 'text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column - Feedback Cards */}
        <div className="space-y-6">
          {[feedbackData[0], feedbackData[2]].map(feedback => (
            <div key={feedback.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={feedback.avatar} alt={feedback.author} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{feedback.author}</h3>
                    <p className="text-xs text-slate-500">{feedback.role} • {feedback.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-0.5">
                    {renderStars(feedback.rating)}
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${feedback.status === 'PENDING' ? 'text-slate-500' : 'text-slate-800'}`}>
                    {feedback.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {feedback.text}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <MessageSquareReply size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 group">
                  {feedback.status === 'PENDING' ? <Circle size={16} className="text-slate-300 group-hover:text-slate-400" /> : <CheckCircle2 size={16} className="text-emerald-500" />}
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Sentiment Chart area */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 text-sm">Review Sentiment</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last 30 Days</span>
            </div>
            {/* Chart placeholder */}
            <div className="h-32 relative flex flex-col justify-end pb-6 border-b border-slate-200">
               {/* Trend line */}
               <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full text-blue-100">
                 <path d="M0,40 L0,20 Q25,30 50,15 T100,10 L100,40 Z" fill="currentColor" />
                 <path d="M0,20 Q25,30 50,15 T100,10" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
               </svg>
               <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-bold text-slate-400 translate-y-4">
                 <span>W1</span>
                 <span>W2</span>
                 <span>W3</span>
                 <span>W4</span>
                 <span>W5</span>
               </div>
            </div>
            <div className="mt-6 text-center">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-800">View Detailed Analytics</button>
            </div>
          </div>

          {/* More Feedback Cards */}
          {[feedbackData[1], feedbackData[3], feedbackData[4]].map(feedback => (
            <div key={feedback.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={feedback.avatar} alt={feedback.author} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{feedback.author}</h3>
                    <p className="text-xs text-slate-500">{feedback.role} • {feedback.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-0.5">
                    {renderStars(feedback.rating)}
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${feedback.status === 'PENDING' ? 'text-slate-500' : 'text-slate-800'}`}>
                    {feedback.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {feedback.text}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <MessageSquareReply size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 group">
                  {feedback.status === 'PENDING' ? <Circle size={16} className="text-slate-300 group-hover:text-slate-400" /> : <CheckCircle2 size={16} className="text-emerald-500" />}
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors bg-slate-50 px-6 py-2.5 rounded-full border border-slate-200">
          Load More Feedback <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><polyline points="21 3 21 8 16 8"></polyline></svg>
        </button>
      </div>
    </div>
  );
}
