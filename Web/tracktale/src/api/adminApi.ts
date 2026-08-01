// src/api/adminApi.ts
// ──────────────────────────────────────────────────────────────
// Admin-specific API calls for trail management.
// Re-exports fetchAllTrails from trailsApi for convenience.
// ──────────────────────────────────────────────────────────────

export { fetchAllTrails, type Trail } from './trailsApi';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://192.168.43.62:5000/api';

/** Delete a trail by ID (DELETE /api/trips/{id}) */
export async function deleteTrail(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/trips/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete trail ${id}: ${res.status}`);
}
