// lib/widgets/trip_card.dart
// -----------------------------------------------------------
// A premium styled card widget for displaying a single trip
// in the home screen list. Shows trip title, status badge,
// waypoint count, and creation date.
// -----------------------------------------------------------

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/trip_model.dart';

class TripCard extends StatelessWidget {
  final TripModel trip;
  final VoidCallback onTap;
  final VoidCallback? onDelete;

  const TripCard({
    super.key,
    required this.trip,
    required this.onTap,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                const Color(0xFF1E2A3A),
                const Color(0xFF16202E),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: _statusColor(trip.status).withOpacity(0.3),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: _statusColor(trip.status).withOpacity(0.1),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Header ───────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 16, 0),
                child: Row(
                  children: [
                    // Status dot
                    Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        color: _statusColor(trip.status),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: _statusColor(trip.status).withOpacity(0.6),
                            blurRadius: 6,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 10),

                    // Status badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _statusColor(trip.status).withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        trip.status.toUpperCase(),
                        style: TextStyle(
                          color: _statusColor(trip.status),
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ),

                    const Spacer(),

                    // Delete button
                    if (onDelete != null)
                      IconButton(
                        onPressed: onDelete,
                        icon: const Icon(Icons.delete_outline_rounded),
                        color: Colors.white24,
                        iconSize: 20,
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                  ],
                ),
              ),

              // ── Title & Description ───────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
                child: Text(
                  trip.title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.3,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),

              if (trip.description.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 6, 20, 0),
                  child: Text(
                    trip.description,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.5),
                      fontSize: 13,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),

              const SizedBox(height: 16),

              // ── Stats Row ─────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                child: Row(
                  children: [
                    _StatChip(
                      icon: Icons.location_on_rounded,
                      label: '${trip.waypoints.length} pins',
                      color: const Color(0xFF6EE7F7),
                    ),
                    const SizedBox(width: 12),
                    _StatChip(
                      icon: Icons.route_rounded,
                      label: '${trip.totalTrackPoints} pts',
                      color: const Color(0xFFA78BFA),
                    ),
                    const Spacer(),
                    Text(
                      DateFormat('MMM d, yyyy').format(trip.createdAt),
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.35),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'ongoing':
        return const Color(0xFF34D399); // Emerald green
      case 'completed':
        return const Color(0xFF6EE7F7); // Cyan
      case 'planned':
      default:
        return const Color(0xFFA78BFA); // Violet
    }
  }
}

// ── Stat Chip Helper ─────────────────────────────────────────
class _StatChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _StatChip({
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: color, size: 14),
        const SizedBox(width: 4),
        Text(
          label,
          style: TextStyle(
            color: color,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
