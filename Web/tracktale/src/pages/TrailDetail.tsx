// src/pages/TrailDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchTrailById, type Trail, type Waypoint } from '../api/trailsApi';
import { fetchReviewsByTrip, createReview, type Review } from '../api/reviewApi';
import { useUserAuth } from '../context/UserAuthContext';
import AuthModal from '../components/AuthModal';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon paths for Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  COMPLETED: { bg: 'bg-cyan-400/10', text: 'text-cyan-400', dot: 'bg-cyan-400', border: 'border-cyan-500/30' },
  ONGOING: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400 animate-pulse', border: 'border-emerald-500/30' },
  PLANNED: { bg: 'bg-violet-400/10', text: 'text-violet-400', dot: 'bg-violet-400', border: 'border-violet-500/30' },
};

export default function TrailDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [hoveredWaypoint, setHoveredWaypoint] = useState<Waypoint | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // ── Fetch trail from backend ────────────────────────────────
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTrailById(id)
      .then(data => { if (!cancelled) { setTrail(data); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [id]);

  // ── Fetch reviews for this trail ────────────────────────────
  useEffect(() => {
    if (!id) return;
    fetchReviewsByTrip(id).then(setReviews).catch(() => {});
  }, [id]);

  // ── Auto-open review form when user logs in via popup ────────
  useEffect(() => {
    if (user && authModalOpen) {
      setAuthModalOpen(false);
      setShowReviewForm(true);
    }
  }, [user, authModalOpen]);

  const handleSubmitReview = async () => {
    if (!user || !id) return;
    setReviewError('');
    setReviewSubmitting(true);
    try {
      const newReview = await createReview(Number(id), user.id, reviewRating, reviewComment);
      setReviews(prev => [newReview, ...prev]);
      setReviewComment('');
      setReviewRating(5);
      setShowReviewForm(false);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const avatarInit = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const fmtDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return iso; }
  };

  // ── Init Leaflet map once trail loads ───────────────────────
  useEffect(() => {
    if (!trail || !mapContainerRef.current || mapRef.current) return;

    // Center on Sri Lanka if no route coords
    const defaultCenter: [number, number] = [7.8731, 80.7718];
    const center: [number, number] = trail.routeCoordinates.length > 0
      ? [
          trail.routeCoordinates.reduce((s, c) => s + c[0], 0) / trail.routeCoordinates.length,
          trail.routeCoordinates.reduce((s, c) => s + c[1], 0) / trail.routeCoordinates.length,
        ]
      : defaultCenter;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: trail.routeCoordinates.length > 0 ? 10 : 7,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Draw route polyline
    if (trail.routeCoordinates.length > 1) {
      const polyline = L.polyline(trail.routeCoordinates as [number, number][], {
        color: '#10b981',
        weight: 4,
        opacity: 0.85,
        dashArray: '10 6',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }

    // Draw waypoint markers
    trail.waypoints.forEach((wp, i) => {
      const isFirst = i === 0;
      const isLast = i === trail.waypoints.length - 1;

      const html = `<div style="
        width:36px;height:36px;border-radius:50%;
        background:${isFirst ? '#10b981' : isLast ? '#f59e0b' : '#a78bfa'};
        border:3px solid white;display:flex;align-items:center;
        justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);
        cursor:pointer;font-size:16px;">
        ${isFirst ? '🚀' : isLast ? '🏁' : '📍'}
      </div>`;

      const icon = L.divIcon({ html, className: '', iconSize: [36, 36], iconAnchor: [18, 18] });

      const marker = L.marker([wp.lat, wp.lng], { icon })
        .addTo(map)
        .on('click', () => { setSelectedWaypoint(wp); setHoveredWaypoint(null); })
        .on('mouseover', () => setHoveredWaypoint(wp))
        .on('mouseout', () => setHoveredWaypoint(prev => prev?.id === wp.id ? null : prev));

      markersRef.current.push(marker);
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, [trail]);

  const handleWaypointClick = (wp: Waypoint) => {
    setSelectedWaypoint(wp);
    if (mapRef.current) {
      mapRef.current.flyTo([wp.lat, wp.lng], 14, { duration: 0.8 });
    }
  };

  // ── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Loading trail...</p>
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────
  if (error || !trail) {
    return (
      <div className="min-h-screen bg-slate-950 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-400 font-semibold text-lg mb-2">Could not load trail</p>
          <p className="text-slate-500 text-sm mb-4">{error ?? 'Trail not found'}</p>
          <button onClick={() => navigate('/explore')} className="text-emerald-400 hover:underline text-sm">← Back to Explore</button>
        </div>
      </div>
    );
  }

  const sc = STATUS_COLORS[trail.status];
  const activeWaypoint = selectedWaypoint || hoveredWaypoint;

  return (
    <>
    <div className="min-h-screen bg-slate-950 pt-16 flex flex-col">
      {/* Top bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/explore')}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-base truncate">{trail.title}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{trail.userAvatar}</span>
                  </div>
                  <span className="text-slate-400 text-xs">{trail.username}</span>
                </div>
                <span className="text-slate-700">·</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${sc.bg} ${sc.border} border`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></div>
                  <span className={`text-xs font-bold ${sc.text}`}>{trail.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex gap-4">
            {[
              { icon: '📍', value: `${trail.waypoints.length}`, label: 'Waypoints' },
              ...(trail.duration ? [{ icon: '⏱', value: trail.duration, label: 'Duration' }] : []),
              ...(trail.location ? [{ icon: '📍', value: trail.location, label: 'Province' }] : []),
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-white font-bold text-sm">{s.icon} {s.value}</p>
                <p className="text-slate-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 112px)' }}>
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: 400 }} />

          {/* Hover tooltip */}
          {hoveredWaypoint && !selectedWaypoint && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
              <div className="bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-3 w-64 shadow-2xl">
                <p className="text-xs font-bold text-violet-400 mb-1">📍 {hoveredWaypoint.name}</p>
                <p className="text-slate-300 text-xs leading-snug">{hoveredWaypoint.note}</p>
                <p className="text-slate-600 text-xs mt-1.5">{hoveredWaypoint.lat.toFixed(5)}, {hoveredWaypoint.lng.toFixed(5)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden flex-shrink-0">
          {/* Selected waypoint panel */}
          {activeWaypoint ? (
            <div className="border-b border-slate-800">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-0.5">Stop Point</p>
                    <h3 className="text-white font-bold">{activeWaypoint.name}</h3>
                  </div>
                  {selectedWaypoint && (
                    <button onClick={() => setSelectedWaypoint(null)} className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">{activeWaypoint.note}</p>

                {/* Waypoint photo or placeholder */}
                {activeWaypoint.imageUrl && !brokenImages.has(activeWaypoint.imageUrl) ? (
                  <div
                    className="w-full h-36 rounded-xl overflow-hidden mb-2 cursor-pointer group relative"
                    onClick={() => setLightboxUrl(activeWaypoint.imageUrl)}
                  >
                    <img
                      src={activeWaypoint.imageUrl}
                      alt={activeWaypoint.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => setBrokenImages(prev => new Set(prev).add(activeWaypoint.imageUrl))}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-28 rounded-xl bg-slate-800 flex items-center justify-center mb-2">
                    <div className="text-center">
                      <svg className="w-8 h-8 text-slate-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <p className="text-slate-500 text-xs">No photo</p>
                    </div>
                  </div>
                )}

                <p className="text-slate-600 text-xs">{activeWaypoint.lat.toFixed(5)}, {activeWaypoint.lng.toFixed(5)}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-800 bg-slate-800/30">
              <p className="text-slate-500 text-xs text-center">
                <span className="block text-slate-400 font-medium mb-0.5">👆 Click or hover a waypoint</span>
                to see stop point details here
              </p>
            </div>
          )}

          {/* Waypoints list */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Stop Points ({trail.waypoints.length})
            </h2>

            {trail.waypoints.length === 0 ? (
              <p className="text-slate-600 text-xs text-center py-6">No waypoints added yet</p>
            ) : (
              <div className="space-y-2">
                {trail.waypoints.map((wp, i) => (
                  <button
                    key={wp.id}
                    onClick={() => handleWaypointClick(wp)}
                    onMouseEnter={() => !selectedWaypoint && setHoveredWaypoint(wp)}
                    onMouseLeave={() => !selectedWaypoint && setHoveredWaypoint(null)}
                    className={`w-full text-left rounded-xl p-3 border transition-all duration-200 ${
                      (selectedWaypoint?.id === wp.id || hoveredWaypoint?.id === wp.id)
                        ? 'bg-violet-500/10 border-violet-500/40'
                        : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                        i === 0 ? 'bg-emerald-500/20 text-emerald-400' :
                        i === trail.waypoints.length - 1 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-violet-500/20 text-violet-400'
                      }`}>
                        {i === 0 ? '🚀' : i === trail.waypoints.length - 1 ? '🏁' : '📍'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-white text-xs font-bold truncate">{wp.name}</p>
                          <span className="text-slate-600 text-xs flex-shrink-0">#{i + 1}</span>
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{wp.note}</p>
                        {wp.imageUrl && !brokenImages.has(wp.imageUrl) && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-4 h-4 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={wp.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={() => setBrokenImages(prev => new Set(prev).add(wp.imageUrl))}
                              />
                            </div>
                            <p className="text-emerald-400 text-xs">📸 Photo</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Trail summary */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Trail Summary</h2>
              {trail.description ? (
                <p className="text-slate-400 text-xs leading-relaxed">{trail.description}</p>
              ) : (
                <p className="text-slate-600 text-xs italic">No description provided.</p>
              )}

              {/* Tags */}
              {trail.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {trail.tags.map(tag => (
                    <span key={tag} className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-md border border-slate-700">{tag}</span>
                  ))}
                </div>
              )}

              {/* Detail grid */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ['📍', 'Province', trail.location || '—'],
                  ['📅', 'Created', trail.createdAt || '—'],
                  ['⏱', 'Duration', trail.duration || '—'],
                  ['🗺️', 'GPS Points', `${trail.routeCoordinates.length}`],
                ].map(([icon, label, value]) => (
                  <div key={label} className="bg-slate-800 rounded-lg p-2">
                    <p className="text-slate-500 text-xs">{icon} {label}</p>
                    <p className="text-white text-xs font-semibold mt-0.5 truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* ── Trail Photos Gallery ──────────────────────────── */}
              {(() => {
                const photosWithWp = trail.waypoints
                  .filter(wp => wp.imageUrl && !brokenImages.has(wp.imageUrl));
                if (photosWithWp.length === 0) return null;
                return (
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      📸 Trail Photos ({photosWithWp.length})
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {photosWithWp.map((wp) => (
                        <div
                          key={`photo-${wp.id}`}
                          className="relative rounded-lg overflow-hidden cursor-pointer group aspect-square"
                          onClick={() => setLightboxUrl(wp.imageUrl)}
                        >
                          <img
                            src={wp.imageUrl}
                            alt={wp.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={() => setBrokenImages(prev => new Set(prev).add(wp.imageUrl))}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white text-xs font-semibold truncate">{wp.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── Reviews Section ───────────────────────── */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    💬 Reviews ({reviews.length})
                  </h2>
                  <button
                    onClick={() => {
                      if (!user) { setAuthModalOpen(true); return; }
                      setShowReviewForm(!showReviewForm);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all"
                  >
                    {showReviewForm ? 'Cancel' : 'Write Review'}
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && user && (
                  <div className="mb-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/40">
                    {/* Star selector */}
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-xs text-slate-400 mr-2">Rating:</span>
                      {[1, 2, 3, 4, 5].map(i => (
                        <button
                          key={i}
                          onClick={() => setReviewRating(i)}
                          className="focus:outline-none"
                        >
                          <svg
                            className={`w-5 h-5 transition-colors ${i <= reviewRating ? 'text-amber-400' : 'text-slate-600 hover:text-slate-500'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    {/* Comment textarea */}
                    <textarea
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      placeholder="Share your experience on this trail…"
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-600/30 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                    />
                    {reviewError && (
                      <p className="text-red-400 text-xs mt-1">{reviewError}</p>
                    )}
                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewSubmitting || !reviewComment.trim()}
                      className="mt-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {reviewSubmitting ? 'Posting…' : 'Post Review'}
                    </button>
                  </div>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <p className="text-slate-500 text-sm">No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {reviews.map(r => (
                      <div key={r.id} className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">{avatarInit(r.user.username)}</span>
                            </div>
                            <div>
                              <p className="text-white text-xs font-semibold">{r.user.username}</p>
                              <p className="text-slate-500 text-[10px]">{fmtDate(r.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                              <svg key={i} className={`w-3 h-3 ${i <= r.rating ? 'text-amber-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{r.comment}</p>
                        {/* Admin reply */}
                        {r.adminReply && (
                          <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                            <div className="flex items-center gap-1.5 mb-1">
                              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span className="text-emerald-400 text-[10px] font-bold uppercase">Admin Reply</span>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed pl-4">{r.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* ── Lightbox modal ─────────────────────────────────────── */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxUrl}
            alt="Full size photo"
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      </div>
    </div>

    {/* Auth Modal for unauthenticated review attempt */}
    <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
