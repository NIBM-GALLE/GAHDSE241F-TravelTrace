// src/api/adminApi.ts
// ──────────────────────────────────────────────────────────────
// Admin-specific API calls for trail and user management.
// ──────────────────────────────────────────────────────────────

export { fetchAllTrails, type Trail } from './trailsApi';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://192.168.43.62:5000/api';

// ── Trail Management ─────────────────────────────────────────

/** Delete a trail by ID (DELETE /api/trips/{id}) */
export async function deleteTrail(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/trips/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete trail ${id}: ${res.status}`);
}

// ── User Management ──────────────────────────────────────────

/** Shape returned by GET /api/users/all */
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  profileImageUrl: string | null;
  status: 'ACTIVE' | 'SUSPENDED';
  totalTrips: number;
  ongoingTrips: number;
  completedTrips: number;
  plannedTrips: number;
}

/** Fetch all users with trip statistics (GET /api/users/all) */
export async function fetchAllUsers(): Promise<AdminUser[]> {
  const res = await fetch(`${BASE_URL}/users/all`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
}

/** Delete a user by ID (DELETE /api/users/{id}) */
export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete user ${id}: ${res.status}`);
}

/** Update a user's status (PATCH /api/users/{id}/status) */
export async function updateUserStatus(
  id: number,
  status: 'ACTIVE' | 'SUSPENDED'
): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update user status: ${res.status}`);
}
