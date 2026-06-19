// src/pages/TrailDetail.tsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { trails, type Waypoint } from '../data/trails';

// Leaflet imports
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon paths for Vite/Webpack
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
  const trail = trails.find(t => t.id === id);

  const [hoveredWaypoint, setHoveredWaypoint] = useState<Waypoint | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!trail || !mapContainerRef.current) return;
    if (mapRef.current) return; // already initialised

    const center: [number, number] = trail.routeCoordinates.length > 0
      ? [
          trail.routeCoordinates.reduce((s, c) => s + c[0], 0) / trail.routeCoordinates.length,
          trail.routeCoordinates.reduce((s, c) => s + c[1], 0) / trail.routeCoordinates.length,
        ]
      : [7.8731, 80.7718];

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 9,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Draw route polyline
    if (trail.routeCoordinates.length > 1) {
      polylineRef.current = L.polyline(trail.routeCoordinates as [number, number][], {
        color: '#10b981',
        weight: 4,
        opacity: 0.85,
        dashArray: '10 6',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      map.fitBounds(polylineRef.current.getBounds(), { padding: [40, 40] });
    }

    // Draw waypoint markers
    trail.waypoints.forEach((wp, i) => {
      const isFirst = i === 0;
      const isLast = i === trail.waypoints.length - 1;

      const html = `
        <div style="
          width: 36px; height: 36px; border-radius: 50%;
          background: ${isFirst ? '#10b981' : isLast ? '#f59e0b' : '#a78bfa'};
          border: 3px solid white;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          cursor: pointer;
          font-size: 16px;
          transition: transform 0.15s ease;
        ">
          ${isFirst ? '🚀' : isLast ? '🏁' : '📍'}
        </div>
      `;

      const icon = L.divIcon({ html, className: '', iconSize: [36, 36], iconAnchor: [18, 18] });

      const marker = L.marker([wp.lat, wp.lng], { icon })
        .addTo(map)
        .on('click', () => {
          setSelectedWaypoint(wp);
          setHoveredWaypoint(null);
        })
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

  if (!trail) {
    return (
      <div className="min-h-screen bg-slate-950 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-xl mb-4">Trail not found</p>
          <Link to="/explore" className="text-emerald-400 hover:underline">← Back to Explore</Link>
        </div>
      </div>
    );
  }

  const sc = STATUS_COLORS[trail.status];
  const activeWaypoint = selectedWaypoint || hoveredWaypoint;

  const handleWaypointClick = (wp: Waypoint) => {
    setSelectedWaypoint(wp);
    if (mapRef.current) {
      mapRef.current.flyTo([wp.lat, wp.lng], 13, { duration: 0.8 });
    }
  };

  return (
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
              { icon: '📏', value: trail.distance, label: 'Distance' },
              { icon: '⏱', value: trail.duration, label: 'Duration' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-white font-bold text-sm">{s.icon} {s.value}</p>
                <p className="text-slate-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content: map + sidebar */}
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 112px)' }}>
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: 400 }} />

          {/* Hover popup on map */}
          {hoveredWaypoint && !selectedWaypoint && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
              <div className="bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-3 w-64 shadow-2xl">
                <p className="text-xs font-bold text-violet-400 mb-1">📍 {hoveredWaypoint.name}</p>
                <p className="text-slate-300 text-xs leading-snug">{hoveredWaypoint.note}</p>
                <p className="text-slate-600 text-xs mt-1.5">
                  {hoveredWaypoint.lat.toFixed(4)}, {hoveredWaypoint.lng.toFixed(4)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
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
                    <button
                      onClick={() => setSelectedWaypoint(null)}
                      className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">{activeWaypoint.note}</p>

                {/* Mock photo placeholder */}
                <div className="w-full h-28 rounded-xl bg-slate-800 flex items-center justify-center mb-2">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-slate-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <p className="text-slate-500 text-xs">Waypoint Photo</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {activeWaypoint.lat.toFixed(5)}, {activeWaypoint.lng.toFixed(5)}
                </div>
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
              All Stop Points ({trail.waypoints.length})
            </h2>
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
                      <p className="text-slate-600 text-xs mt-1">{new Date(wp.timestamp).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Trail summary */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Trail Summary</h2>
              <p className="text-slate-400 text-xs leading-relaxed">{trail.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {trail.tags.map(tag => (
                  <span key={tag} className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-md border border-slate-700">{tag}</span>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ['📍', 'Location', trail.location],
                  ['📅', 'Created', trail.createdAt],
                  ['📏', 'Distance', trail.distance],
                  ['⏱', 'Duration', trail.duration],
                ].map(([icon, label, value]) => (
                  <div key={label} className="bg-slate-800 rounded-lg p-2">
                    <p className="text-slate-500 text-xs">{icon} {label}</p>
                    <p className="text-white text-xs font-semibold mt-0.5 truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
