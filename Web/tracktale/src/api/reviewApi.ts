// src/api/reviewApi.ts
// ──────────────────────────────────────────────────────────────
// API client for the Review system.
// Communicates with Spring Boot backend /api/reviews endpoints.
// ──────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://192.168.43.62:5000/api';

// ── TypeScript interfaces ────────────────────────────────────

export interface ReviewUser {
  id: number;
  username: string;
  email: string;
  profileImageUrl: string | null;
}

export interface ReviewTrip {
  id: number;
  title: string;
  province: string | null;
  duration: string | null;
  tags: string | null;
  status: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  adminReply: string | null;
  adminRepliedAt: string | null;
  user: ReviewUser;
  trip: ReviewTrip;
}

// ── API calls ────────────────────────────────────────────────

/** Create a new review for a trail. */
export async function createReview(
  tripId: number,
  userId: number,
  rating: number,
  comment: string
): Promise<Review> {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tripId, userId, rating, comment }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Failed to create review: ${res.status}`);
  }
  return res.json();
}

/** Fetch all reviews for a specific trail. */
export async function fetchReviewsByTrip(tripId: number | string): Promise<Review[]> {
  const res = await fetch(`${BASE_URL}/reviews/trip/${tripId}`);
  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
  return res.json();
}

/** Fetch all reviews across all trails — for admin and Reviews page. */
export async function fetchAllReviews(): Promise<Review[]> {
  const res = await fetch(`${BASE_URL}/reviews/all`);
  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
  return res.json();
}

/** Admin replies to a review. */
export async function adminReplyToReview(
  reviewId: number,
  adminReply: string
): Promise<Review> {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}/reply`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminReply }),
  });
  if (!res.ok) throw new Error(`Failed to reply: ${res.status}`);
  return res.json();
}

/** Delete a review by ID — admin use. */
export async function deleteReview(reviewId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete review: ${res.status}`);
}
