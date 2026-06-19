// src/pages/Explore.tsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllTrails, type Trail } from '../api/trailsApi';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  COMPLETED: { bg: 'bg-cyan-400/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  ONGOING: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  PLANNED: { bg: 'bg-violet-400/10', text: 'text-violet-400', dot: 'bg-violet-400' },
};

const STATUS_FILTERS = ['All', 'COMPLETED', 'ONGOING', 'PLANNED'];

// ── Trail Card ────────────────────────────────────────────────
function TrailCard({ trail }: { trail: Trail }) {
  const sc = STATUS_COLORS[trail.status];

  // Compute bounding box for the mini SVG route
  const lats = trail.routeCoordinates.map(c => c[0]);
  const lngs = trail.routeCoordinates.map(c => c[1]);
  const minLat = lats.length ? Math.min(...lats) : 0;
  const maxLat = lats.length ? Math.max(...lats) : 1;
  const minLng = lngs.length ? Math.min(...lngs) : 0;
  const maxLng = lngs.length ? Math.max(...lngs) : 1;
  const latSpan = Math.max(maxLat - minLat, 0.001);
  const lngSpan = Math.max(maxLng - minLng, 0.001);

  const toSvgPoint = (lat: number, lng: number) => {
    const x = ((lng - minLng) / lngSpan) * 320 + 40;
    const y = 176 - ((lat - minLat) / latSpan) * 120 - 28;
    return `${x},${y}`;
  };

  return (
    <Link
      to={`/trail/${trail.id}`}
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col"
    >
      {/* Cover — mini route map */}
      <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-700 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(16,185,129,0.15) 0%, transparent 60%),
            radial-gradient(circle at 70% 30%, rgba(139,92,246,0.1) 0%, transparent 50%)`,
        }}></div>

        {trail.routeCoordinates.length > 1 ? (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 176" preserveAspectRatio="none">
            <polyline
              points={trail.routeCoordinates.map(([lat, lng]) => toSvgPoint(lat, lng)).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 3"
              opacity="0.8"
            />
            {trail.waypoints.map((wp, i) => (
              <circle key={i} cx={toSvgPoint(wp.lat, wp.lng).split(',')[0]} cy={toSvgPoint(wp.lat, wp.lng).split(',')[1]}
                r="5" fill="#a78bfa" stroke="white" strokeWidth="1.5" opacity="0.9" />
            ))}
          </svg>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-10 h-10 text-slate-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-slate-600 text-xs">No route yet</p>
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${trail.status === 'ONGOING' ? 'animate-pulse' : ''}`}></div>
            <span className={`text-xs font-bold ${sc.text}`}>{trail.status}</span>
          </div>
        </div>

        {/* Hover arrow */}
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
        {/* User row */}
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
          {trail.description || 'No description provided.'}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs border-t border-slate-800 pt-3 mt-auto flex-wrap">
          <div className="flex items-center gap-1 text-slate-400">
            <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {trail.waypoints.length} pins
          </div>
          {trail.duration && (
            <div className="flex items-center gap-1 text-slate-400">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {trail.duration}
            </div>
          )}
          {trail.location && (
            <div className="flex items-center gap-1 text-slate-500 ml-auto">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="truncate max-w-[100px]">{trail.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Loading skeleton ──────────────────────────────────────────
function TrailSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-800"></div>
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-700"></div>
          <div className="h-3 bg-slate-700 rounded w-24 mt-2"></div>
        </div>
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-800 rounded w-full"></div>
        <div className="h-3 bg-slate-800 rounded w-2/3"></div>
      </div>
    </div>
  );
}

// ── Explore Page ──────────────────────────────────────────────
export default function Explore() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTag, setActiveTag] = useState('All Tags');
  const [search, setSearch] = useState('');

  // Load from real backend
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAllTrails()
      .then(data => { if (!cancelled) { setTrails(data); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // Build dynamic tag list from loaded data
  const allTags = useMemo(() => {
    const set = new Set<string>();
    trails.forEach(t => t.tags.forEach(tag => set.add(tag)));
    return ['All Tags', ...Array.from(set).sort()];
  }, [trails]);

  const filtered = useMemo(() => trails.filter(t => {
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchTag = activeTag === 'All Tags' || t.tags.includes(activeTag);
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      t.title.toLowerCase().includes(q) ||
      t.username.toLowerCase().includes(q) ||
      (t.location ?? '').toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    return matchStatus && matchTag && matchSearch;
  }), [trails, statusFilter, activeTag, search]);

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Community</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3">Explore Sri Lankan Trails</h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Discover journeys created by travellers exploring the beauty of Sri Lanka.
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
                placeholder="Search trails, users, provinces..."
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
        <div className="flex flex-col gap-3 mb-8">
          {/* Status filters */}
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
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

          {/* Tag filters — dynamic from real data */}
          {!loading && allTags.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTag === tag
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-slate-500 text-xs mb-5">
            Showing <span className="text-white font-semibold">{filtered.length}</span> of {trails.length} trails
          </p>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-rose-400 font-semibold">Could not load trails</p>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">{error}</p>
            <p className="text-slate-600 text-xs mt-2">Make sure the Spring Boot backend is running and reachable.</p>
            <button
              onClick={() => { setLoading(true); setError(null); fetchAllTrails().then(setTrails).catch(e => setError(e.message)).finally(() => setLoading(false)); }}
              className="mt-4 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <TrailSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-slate-400 font-semibold">
              {trails.length === 0 ? 'No trails created yet' : 'No trails match your filters'}
            </p>
            <p className="text-slate-600 text-sm mt-1">
              {trails.length === 0
                ? 'Create your first trail using the mobile app!'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}

        {/* Trail grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(trail => <TrailCard key={trail.id} trail={trail} />)}
          </div>
        )}
      </div>
    </div>
  );
}
