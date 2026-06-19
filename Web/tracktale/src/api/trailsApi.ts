// src/api/trailsApi.ts
// ──────────────────────────────────────────────────────────────
// Real API client for the TravelTrace Spring Boot backend.
// Replaces the static mock data in trails.ts.
// ──────────────────────────────────────────────────────────────

// Backend base URL — reads from Vite env var, falls back to local
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://192.168.43.62:5000/api';

// ── TypeScript interfaces matching Spring Boot entity ─────────

export interface Waypoint {
  id: string;          // synthetic (index)
  name: string;
  note: string;
  imageUrl: string;    // Cloudinary URL or empty string
  lat: number;
  lng: number;
  timestamp: string;
}

export interface BackendUser {
  id: number;
  username: string;
  email: string;
}

/** Raw shape returned by Spring Boot */
export interface BackendTrip {
  id: number;
  title: string;
  description: string | null;
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED';
  province: string | null;
  duration: string | null;
  tags: string | null;        // comma-separated e.g. "Hiking,Scenic"
  routeData: string | null;   // JSON string "[[lng,lat],[lng,lat]]"
  waypointsData: string | null; // JSON string "[{...},{...}]"
  user: BackendUser;
}

/** Normalised trail shape used throughout the web app */
export interface Trail {
  id: string;
  title: string;
  username: string;
  userAvatar: string;        // 2-letter initials
  description: string;
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED';
  location: string;          // = province
  distance: string;          // not stored yet — shown as '-'
  duration: string;
  waypoints: Waypoint[];
  routeCoordinates: [number, number][]; // [lat, lng] order for Leaflet
  coverImage: string;
  createdAt: string;         // "YYYY-MM-DD"
  tags: string[];
}

// ── Parsers ───────────────────────────────────────────────────

function parseRouteCoordinates(routeData: string | null): [number, number][] {
  if (!routeData || routeData === '[]') return [];
  try {
    // Backend stores as [[lng, lat], ...] → convert to [lat, lng] for Leaflet
    const raw = JSON.parse(routeData) as [number, number][];
    return raw.map(([lng, lat]) => [lat, lng]);
  } catch {
    return [];
  }
}

function parseWaypoints(waypointsData: string | null): Waypoint[] {
  if (!waypointsData || waypointsData === '[]') return [];
  try {
    const raw = JSON.parse(waypointsData) as Record<string, unknown>[];
    return raw.map((w, i) => ({
      id: String(i),
      name: (w.name as string) ?? 'Waypoint',
      note: (w.note as string) ?? '',
      imageUrl: ((w.imageUrl ?? w.photoUrl) as string) ?? '',
      lat: Number(w.lat ?? w.latitude ?? 0),
      lng: Number(w.lng ?? w.longitude ?? 0),
      timestamp: (w.timestamp as string) ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function avatarInitials(username: string): string {
  const parts = username.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return username.substring(0, 2).toUpperCase();
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toISOString().split('T')[0]; // "YYYY-MM-DD"
  } catch {
    return '';
  }
}

export function mapBackendTrip(trip: BackendTrip): Trail {
  const tags = trip.tags
    ? trip.tags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return {
    id: String(trip.id),
    title: trip.title,
    username: trip.user.username,
    userAvatar: avatarInitials(trip.user.username),
    description: trip.description ?? '',
    status: trip.status,
    location: trip.province ?? '',
    distance: '-',
    duration: trip.duration ?? '',
    waypoints: parseWaypoints(trip.waypointsData),
    routeCoordinates: parseRouteCoordinates(trip.routeData),
    coverImage: '',
    createdAt: `#${trip.id}`,   // No timestamp in DB yet — show trip number
    tags,
  };
}

// ── API calls ─────────────────────────────────────────────────

/** Fetch all public trails (GET /api/trips/all) */
export async function fetchAllTrails(): Promise<Trail[]> {
  const res = await fetch(`${BASE_URL}/trips/all`);
  if (!res.ok) throw new Error(`Failed to fetch trails: ${res.status}`);
  const data: BackendTrip[] = await res.json();
  return data.map(mapBackendTrip);
}

/** Fetch a single trail by ID (GET /api/trips/{id}) */
export async function fetchTrailById(id: string): Promise<Trail> {
  const res = await fetch(`${BASE_URL}/trips/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch trail ${id}: ${res.status}`);
  const data: BackendTrip = await res.json();
  return mapBackendTrip(data);
}
