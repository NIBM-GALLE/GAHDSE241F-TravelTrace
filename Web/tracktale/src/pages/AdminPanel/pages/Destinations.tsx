import { useState } from 'react';
import { 
  Plus, Grid, List, Edit2, Trash2, Star,
  Map, Navigation
} from 'lucide-react';

const destinations = [
  {
    id: 1,
    title: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1000&auto=format&fit=crop',
    description: 'The quintessential Cycladic experience, famous for its dramatic volcanic cliffs, iconic sunsets, and luxury boutique stays overlooking the caldera.',
    trips: 24,
    rating: 4.9,
    size: 'large'
  },
  {
    id: 2,
    title: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop',
    description: 'A neon-lit metropolis where ancient tradition meets futuristic technology. Renowned for its world-class culinary scene and bustling stree...',
    trips: 18,
    rating: 4.8,
    size: 'normal'
  },
  {
    id: 3,
    title: 'Positano',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1516483638261-f4088921cbb3?q=80&w=1000&auto=format&fit=crop',
    description: 'The crown jewel of the Amalfi Coast, offering vertical landscapes, luxury beach clubs, and iconic Italian charm.',
    trips: 12,
    rating: 4.7,
    size: 'normal'
  },
  {
    id: 4,
    title: 'Cusco',
    country: 'Peru',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop',
    description: 'The gateway to the Andes, Cusco blends colonial history with ancient Incan heritage in a stunning high-altitude setting.',
    trips: 7,
    rating: 4.6,
    size: 'normal'
  }
];

export default function Destinations() {
  const [activeTab, setActiveTab] = useState('All Regions');

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-1">Global Portfolio</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Destination Management</h2>
          <p className="text-slate-500 text-sm max-w-2xl">
            Curate and oversee the world's most sought-after travel locations. Monitor engagement metrics and manage entry points for global itineraries.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Active Database</p>
              <p className="text-lg font-bold text-slate-800 leading-none">142</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={16} />
              Add Destination
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>View:</span>
            <div className="flex bg-slate-100 rounded p-0.5">
              <button className="p-1 bg-white shadow-sm rounded text-slate-800"><Grid size={16} /></button>
              <button className="p-1 text-slate-400 hover:text-slate-600"><List size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          {['All Regions', 'Europe', 'Asia-Pacific', 'Americas'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab 
                  ? 'text-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Large item taking 2 columns */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
          <div className="h-64 relative overflow-hidden bg-slate-100">
             <img src={destinations[0].image} alt={destinations[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-5 flex justify-between items-end flex-1">
             <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
               {destinations[0].description}
             </p>
             <div className="flex flex-col items-end gap-3 flex-shrink-0">
               <div className="text-right">
                 <p className="text-2xl font-bold text-slate-800 leading-none mb-1">{destinations[0].trips}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Trips</p>
               </div>
               <div className="flex gap-2">
                 <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                   <Edit2 size={18} />
                 </button>
                 <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                   <Trash2 size={18} />
                 </button>
               </div>
             </div>
          </div>
        </div>

        {/* Regular item Tokyo */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
          <div className="h-48 relative overflow-hidden bg-slate-100">
             <img src={destinations[1].image} alt={destinations[1].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-5 flex flex-col flex-1">
             <div className="flex justify-between items-start mb-1">
               <h3 className="font-bold text-slate-800 text-lg leading-tight">{destinations[1].title}</h3>
               <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                 {destinations[1].rating} <Star size={14} className="text-slate-700 fill-slate-700" />
               </div>
             </div>
             <p className="text-xs text-slate-500 mb-3">{destinations[1].country}</p>
             <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
               {destinations[1].description}
             </p>
             <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-auto">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{destinations[1].trips} Active Trips</p>
               <div className="flex gap-2">
                 <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                   <Edit2 size={18} />
                 </button>
                 <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                   <Trash2 size={18} />
                 </button>
               </div>
             </div>
          </div>
        </div>

        {/* Regular item Positano */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
          <div className="h-48 relative overflow-hidden bg-slate-100">
             <img src={destinations[2].image} alt={destinations[2].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-5 flex flex-col flex-1">
             <div className="flex justify-between items-start mb-1">
               <h3 className="font-bold text-slate-800 text-lg leading-tight">{destinations[2].title}</h3>
               <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                 {destinations[2].rating} <Star size={14} className="text-slate-700 fill-slate-700" />
               </div>
             </div>
             <p className="text-xs text-slate-500 mb-3">{destinations[2].country}</p>
             <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
               {destinations[2].description}
             </p>
             <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-auto">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{destinations[2].trips} Active Trips</p>
               <div className="flex gap-2">
                 <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                   <Edit2 size={18} />
                 </button>
                 <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                   <Trash2 size={18} />
                 </button>
               </div>
             </div>
          </div>
        </div>

        {/* Regular item Cusco */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
          <div className="h-48 relative overflow-hidden bg-slate-100">
             <img src={destinations[3].image} alt={destinations[3].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-5 flex flex-col flex-1">
             <div className="flex justify-between items-start mb-1">
               <h3 className="font-bold text-slate-800 text-lg leading-tight">{destinations[3].title}</h3>
               <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                 {destinations[3].rating} <Star size={14} className="text-slate-700 fill-slate-700" />
               </div>
             </div>
             <p className="text-xs text-slate-500 mb-3">{destinations[3].country}</p>
             <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
               {destinations[3].description}
             </p>
             <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-auto">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{destinations[3].trips} Active Trips</p>
               <div className="flex gap-2">
                 <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                   <Edit2 size={18} />
                 </button>
                 <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                   <Trash2 size={18} />
                 </button>
               </div>
             </div>
          </div>
        </div>

        {/* New Discovery Placeholder */}
        <div className="rounded-2xl border border-slate-200 border-dashed bg-slate-50/50 flex flex-col group p-6">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">New Discovery</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Explore the geothermal wonders and modern Nordic culture of Iceland's capital.
          </p>
          <div className="mt-auto flex justify-center pb-4">
             <button className="flex flex-col items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors">
               <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                 <Map size={24} />
               </div>
               <span className="text-sm font-medium">Explore Map Location</span>
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
