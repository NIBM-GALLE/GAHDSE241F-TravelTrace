// src/pages/Explore.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trails } from '../data/trails';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  COMPLETED: { bg: 'bg-cyan-400/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  ONGOING: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  PLANNED: { bg: 'bg-violet-400/10', text: 'text-violet-400', dot: 'bg-violet-400' },
};

const FILTERS = ['All', 'COMPLETED', 'ONGOING', 'PLANNED'];
const TAG_FILTERS = ['All Tags', 'Heritage', 'Culture', 'Adventure', 'Hiking', 'Scenic', 'Coastal', 'Wildlife', 'City', 'Photography', 'National Park'];

export default function Explore() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All Tags');
  const [search, setSearch] = useState('');

  const filtered = trails.filter(t => {
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchTag = tagFilter === 'All Tags' || t.tags.includes(tagFilter);
    const matchSearch = search.trim() === '' || t.title.toLowerCase().includes(search.toLowerCase()) || t.username.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchTag && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Community</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3">Explore Sri Lankan Trails</h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Discover journeys created by travellers exploring the beauty of Sri Lanka — from ancient fortresses to coastal paradises.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-lg mx-auto mt-8">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search trails, users, destinations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === f
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
                }`}
              >
                {f === 'All' ? 'All Status' : f}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-slate-700 hidden sm:block"></div>
          <div className="flex gap-2 flex-wrap">
            {TAG_FILTERS.slice(0, 6).map(tag => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tagFilter === tag
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-slate-500 text-xs mb-5">
          Showing <span className="text-white font-semibold">{filtered.length}</span> of {trails.length} trails
        </p>

        {/* Trail grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-slate-400 font-semibold">No trails found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(trail => {
              const sc = STATUS_COLORS[trail.status];
              return (
                <Link
                  key={trail.id}
                  to={`/trail/${trail.id}`}
                  className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col"
                >
                  {/* Cover */}
                  <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-700 overflow-hidden flex-shrink-0">
                    {/* Map-like pattern */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(16,185,129,0.15) 0%, transparent 60%),
                          radial-gradient(circle at 70% 30%, rgba(139,92,246,0.1) 0%, transparent 50%)`,
                      }}></div>
                      <svg className="w-full h-full" viewBox="0 0 400 176" fill="none">
                        {/* Simplified route line */}
                        <polyline
                          points={trail.routeCoordinates.map((c, i) => {
                            const x = ((c[1] - Math.min(...trail.routeCoordinates.map(p => p[1]))) / Math.max(0.01, Math.max(...trail.routeCoordinates.map(p => p[1])) - Math.min(...trail.routeCoordinates.map(p => p[1])))) * 320 + 40;
                            const y = 176 - ((c[0] - Math.min(...trail.routeCoordinates.map(p => p[0]))) / Math.max(0.01, Math.max(...trail.routeCoordinates.map(p => p[0])) - Math.min(...trail.routeCoordinates.map(p => p[0])))) * 120 - 28;
                            return `${x},${y}`;
                          }).join(' ')}
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="6 3"
                          opacity="0.8"
                        />
                        {/* Waypoint dots */}
                        {trail.waypoints.map((wp, i) => {
                          const lats = trail.routeCoordinates.map(p => p[0]);
                          const lngs = trail.routeCoordinates.map(p => p[1]);
                          const x = ((wp.lng - Math.min(...lngs)) / Math.max(0.01, Math.max(...lngs) - Math.min(...lngs))) * 320 + 40;
                          const y = 176 - ((wp.lat - Math.min(...lats)) / Math.max(0.01, Math.max(...lats) - Math.min(...lats))) * 120 - 28;
                          return (
                            <g key={i}>
                              <circle cx={x} cy={y} r="6" fill="#a78bfa" stroke="white" strokeWidth="1.5" />
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.bg} border border-current/20`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${trail.status === 'ONGOING' ? 'animate-pulse' : ''}`}></div>
                        <span className={`text-xs font-bold ${sc.text}`}>{trail.status}</span>
                      </div>
                    </div>

                    {/* Arrow hint */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>

                    {/* Tags */}
                    <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                      {trail.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-slate-900/70 backdrop-blur text-slate-300 text-xs px-2 py-0.5 rounded-md">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* User */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{trail.userAvatar}</span>
                      </div>
                      <span className="text-slate-400 text-xs">{trail.username}</span>
                      <span className="ml-auto text-slate-600 text-xs">{trail.createdAt}</span>
                    </div>

                    <h3 className="text-white font-bold text-base mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {trail.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                      {trail.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs border-t border-slate-800 pt-3 mt-auto">
                      <div className="flex items-center gap-1 text-slate-400">
                        <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {trail.waypoints.length} pins
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                        </svg>
                        {trail.distance}
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {trail.duration}
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-slate-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {trail.location}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
