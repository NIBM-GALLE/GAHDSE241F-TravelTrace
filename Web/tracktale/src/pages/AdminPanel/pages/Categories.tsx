import { Filter, Plus } from 'lucide-react';

export default function Categories() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-1">Taxonomy & Classification</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Travel Categories</h2>
          <p className="text-slate-500 text-sm max-w-2xl">
            Define and organize global travel experiences. These categories drive the user discovery engine and search filtering across all platforms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Add Category
          </button>
        </div>
      </div>
      
      {/* Empty State / Placeholder since image 6 has no content below header */}
      <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center mt-8">
        <div className="w-16 h-16 bg-slate-200 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
           <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3L8 21"/><path d="M16 3l-2 18"/></svg>
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">No Categories Yet</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          Start building your travel taxonomy by adding your first category. Categories help users find experiences tailored to their preferences.
        </p>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors">
          <Plus size={18} />
          Create First Category
        </button>
      </div>
    </div>
  );
}
