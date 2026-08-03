// src/pages/Explore.tsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchApprovedTrails, type Trail } from '../api/trailsApi';
import { fetchAllReviews, type Review } from '../api/reviewApi';

interface TrailWithStats extends Trail {
  reviewCount: number;
  avgRating: number;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  COMPLETED: { bg: 'bg-cyan-400/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  ONGOING: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  PLANNED: { bg: 'bg-violet-400/10', text: 'text-violet-400', dot: 'bg-violet-400' },
};

const STATUS_FILTERS = ['All', 'COMPLETED', 'ONGOING', 'PLANNED'];
type SortOption = 'popular' | 'rating' | 'newest';

// ── Trail Card ────────────────────────────────────────────────
function TrailCard({ trail, rank }: { trail: TrailWithStats; rank?: number }) {
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

  const isPopular = trail.reviewCount > 0;

  return (
    <Link
      to={`/trail/${trail.id}`}
      className={`group bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col relative ${
        rank === 1 && trail.reviewCount > 0
          ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 hover:border-amber-400'
          : isPopular
          ? 'border-emerald-500/40 hover:border-emerald-400 shadow-lg shadow-emerald-500/5'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Cover — mini route map */}
      <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-700 overflow-hidden flex-shrink-0">
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
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.bg} backdrop-blur-md border border-white/5`}>
            <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${trail.status === 'ONGOING' ? 'animate-pulse' : ''}`}></div>
            <span className={`text-xs font-bold ${sc.text}`}>{trail.status}</span>
          </div>

          {/* Popular Rank Badge — ONLY for trails with reviewCount > 0 */}
          {rank !== undefined && rank <= 3 && trail.reviewCount > 0 && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-md ${
              rank === 1
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950'
                : rank === 2
                ? 'bg-slate-300 text-slate-950'
                : 'bg-amber-700/90 text-amber-200'
            }`}>
              <span>🔥 #{rank} Popular</span>
            </div>
          )}
        </div>

        {/* Review Counter Pill (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-white">
          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{trail.avgRating > 0 ? trail.avgRating.toFixed(1) : 'New'}</span>
          <span className="text-slate-400 text-[10px]">({trail.reviewCount})</span>
        </div>

        {/* Tags */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
          {trail.tags.slice(0, 2).map(tag => (
            <span key={tag} className="bg-slate-950/70 backdrop-blur text-slate-300 text-xs px-2 py-0.5 rounded-md border border-slate-700/50">{tag}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* User row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">{trail.userAvatar}</span>
          </div>
          <span className="text-slate-400 text-xs font-medium">{trail.username}</span>
          <span className="ml-auto text-slate-600 text-xs">{trail.createdAt}</span>
        </div>

        <h3 className="text-white font-bold text-base mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {trail.title}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
          {trail.description || 'No description provided.'}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-3 mt-auto flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-400">
              <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {trail.waypoints.length} pins
            </div>

            {/* Popularity Badge Count */}
            <div className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>{trail.reviewCount} {trail.reviewCount === 1 ? 'review' : 'reviews'}</span>
            </div>
          </div>

          {trail.location && (
            <div className="flex items-center gap-1 text-slate-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="truncate max-w-[90px]">{trail.location}</span>
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
      <div className="h-48 bg-slate-800"></div>
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
  const [trails, setTrails] = useState<TrailWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTag, setActiveTag] = useState('All Tags');
  const [sortBy, setSortBy] = useState<SortOption>('popular'); // Default: Most Popular!
  const [search, setSearch] = useState('');

  // Load from real backend — fetch approved trails and calculate review stats
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchApprovedTrails(),
      fetchAllReviews().catch(() => [])
    ]).then(([approvedTrails, allReviews]) => {
      if (cancelled) return;

      // Group review count and average rating per trail ID
      const statsMap = new Map<string, { count: number; totalRating: number }>();
      allReviews.forEach(r => {
        const tripIdStr = String(r.trip?.id);
        if (tripIdStr) {
          const cur = statsMap.get(tripIdStr) || { count: 0, totalRating: 0 };
          statsMap.set(tripIdStr, {
            count: cur.count + 1,
            totalRating: cur.totalRating + (r.rating || 5),
          });
        }
      });

      const enriched: TrailWithStats[] = approvedTrails.map(t => {
        const st = statsMap.get(String(t.id));
        const count = st?.count ?? 0;
        const avg = count > 0 ? (st!.totalRating / count) : 0;
        return {
          ...t,
          reviewCount: count,
          avgRating: avg,
        };
      });

      setTrails(enriched);
      setLoading(false);
    }).catch(err => {
      if (!cancelled) {
        setError(err.message);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, []);

  // Build dynamic tag list from loaded data
  const allTags = useMemo(() => {
    const set = new Set<string>();
    trails.forEach(t => t.tags.forEach(tag => set.add(tag)));
    return ['All Tags', ...Array.from(set).sort()];
  }, [trails]);

  // Filter and Sort Trails
  const filteredAndSorted = useMemo(() => {
    // 1. Filter
    const result = trails.filter(t => {
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchTag = activeTag === 'All Tags' || t.tags.includes(activeTag);
      const q = search.trim().toLowerCase();
      const matchSearch = !q ||
        t.title.toLowerCase().includes(q) ||
        t.username.toLowerCase().includes(q) ||
        (t.location ?? '').toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return matchStatus && matchTag && matchSearch;
    });

    // 2. Sort
    return result.sort((a, b) => {
      if (sortBy === 'popular') {
        // Most Reviews first -> tie-breaker: highest rating -> newest ID
        if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount;
        if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
        return Number(b.id) - Number(a.id);
      }
      if (sortBy === 'rating') {
        // Highest Avg Rating first -> tie-breaker: review count
        if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
        return b.reviewCount - a.reviewCount;
      }
      // Newest
      return Number(b.id) - Number(a.id);
    });
  }, [trails, statusFilter, activeTag, search, sortBy]);

  // Top 10 Popular Trails — ONLY trails that actually have reviews (reviewCount > 0)
  const topPopularTrails = useMemo(() => {
    return trails
      .filter(t => t.reviewCount > 0)
      .sort((a, b) => b.reviewCount - a.reviewCount || b.avgRating - a.avgRating)
      .slice(0, 10);
  }, [trails]);

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/80">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover opacity-25"
            src="/explore.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Community Trails</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3">Explore Sri Lankan Trails</h1>
            <p className="text-slate-300 max-w-xl mx-auto text-sm">
              Discover popular journeys ranked by community reviews and ratings across Sri Lanka.
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
                className="w-full bg-slate-800/85 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Featured Most Popular Section (Only shows trails with reviewCount > 0!) ──────── */}
        {!loading && !error && topPopularTrails.length > 0 && search === '' && statusFilter === 'All' && activeTag === 'All Tags' && (
          <div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-slate-900 border border-amber-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  🔥 Most Popular Trails <span className="text-xs text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">Top {topPopularTrails.length} by Reviews</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topPopularTrails.map((trail, index) => (
                <Link
                  key={`top-${trail.id}`}
                  to={`/trail/${trail.id}`}
                  className="group bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 hover:border-amber-400 transition-all shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        index === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-300'
                      }`}>
                        #{index + 1} Most Reviewed
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {trail.avgRating > 0 ? trail.avgRating.toFixed(1) : '5.0'}
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-base group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                      {trail.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-3">
                      {trail.description || 'Explore this trending trail in Sri Lanka.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 text-slate-400">
                    <span>By {trail.username}</span>
                    <span className="text-emerald-400 font-semibold">{trail.reviewCount} {trail.reviewCount === 1 ? 'Review' : 'Reviews'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Controls & Sorting Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-800/80">
          
          {/* Status & Tag filters */}
          <div className="flex flex-col gap-3">
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

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'popular'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔥 Most Reviews (Popular)
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'rating'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⭐ Highest Rated
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'newest'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🆕 Newest
            </button>
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-slate-500 text-xs mb-5">
            Showing <span className="text-white font-semibold">{filteredAndSorted.length}</span> of {trails.length} trails (sorted by <span className="text-amber-400 font-semibold">{sortBy === 'popular' ? 'Most Reviews' : sortBy === 'rating' ? 'Highest Rating' : 'Newest'}</span>)
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
            <button
              onClick={() => window.location.reload()}
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
        {!loading && !error && filteredAndSorted.length === 0 && (
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
        {!loading && !error && filteredAndSorted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((trail, index) => (
              <TrailCard
                key={trail.id}
                trail={trail}
                rank={sortBy === 'popular' ? index + 1 : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
