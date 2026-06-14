// lib/models/trip_model.dart
// -----------------------------------------------------------
// Dart data classes mirroring the Spring Boot / MySQL Trip entity.
//
// Spring Boot response shape (plain entity — no wrapper):
// {
//   "id": 1,
//   "title": "Bali Escape",
//   "description": "...",
//   "status": "PLANNED",
//   "routeData": "[[103.82,1.35],[103.83,1.36]]",   // JSON string
//   "waypointsData": "[{\"lat\":1.35,\"lng\":103.82,\"note\":\"Hotel\"}]",
//   "user": { "id": 1, "username": "demo", "email": "..." }
// }
//
// Coordinate order stored in routeData: [longitude, latitude]
// -----------------------------------------------------------

import 'dart:convert';

/// A single waypoint pin — parsed from the waypointsData JSON string.
class WaypointModel {
  final String id;     // synthetic index-based id (no DB id stored in JSON string)
  final String name;
  final String note;
  final String photoUrl;
  final double longitude;
  final double latitude;
  final DateTime createdAt;

  const WaypointModel({
    required this.id,
    required this.name,
    required this.note,
    required this.photoUrl,
    required this.longitude,
    required this.latitude,
    required this.createdAt,
  });

  /// Parse a waypoint from a flat JSON object stored inside waypointsData.
  /// Expected shape: { "lat": 1.35, "lng": 103.82, "note": "...",
  ///                   "name": "...", "imageUrl": "...", "timestamp": "..." }
  factory WaypointModel.fromJson(Map<String, dynamic> json, {String id = ''}) {
    return WaypointModel(
      id: id,
      name: json['name'] as String? ?? 'Waypoint',
      note: json['note'] as String? ?? '',
      photoUrl: (json['imageUrl'] ?? json['photoUrl'] ?? '') as String,
      longitude: _toDouble(json['lng'] ?? json['longitude'] ?? 0),
      latitude:  _toDouble(json['lat'] ?? json['latitude']  ?? 0),
      createdAt: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  /// Serialize for sending to PUT /api/trips/{id}/waypoint as waypointJson.
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'note': note,
      'imageUrl': photoUrl,
      'lng': longitude,
      'lat': latitude,
      'timestamp': createdAt.toIso8601String(),
    };
  }

  @override
  String toString() =>
      'WaypointModel(id: $id, name: $name, lat: $latitude, lng: $longitude)';
}

// ─────────────────────────────────────────────────────────────

/// Represents a full trip with route coords and waypoints,
/// mapped from a Spring Boot Trip entity response.
class TripModel {
  final String id;           // Long from backend, stored as String in Dart
  final String userId;       // Long from backend user.id
  final String title;
  final String description;
  final String status;       // 'PLANNED' | 'ONGOING' | 'COMPLETED'
  final List<List<double>> routeCoordinates; // [[lng, lat], ...]
  final List<WaypointModel> waypoints;
  final String coverPhotoUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  const TripModel({
    required this.id,
    required this.userId,
    required this.title,
    required this.description,
    required this.status,
    required this.routeCoordinates,
    required this.waypoints,
    required this.coverPhotoUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  /// Parse a TripModel from a Spring Boot entity JSON response.
  factory TripModel.fromJson(Map<String, dynamic> json) {
    // ── Route coordinates ──────────────────────────────────────
    // routeData is stored as a JSON string: "[[lng,lat],[lng,lat]]"
    List<List<double>> routeCoords = [];
    final rawRoute = json['routeData'] as String?;
    if (rawRoute != null && rawRoute.isNotEmpty && rawRoute != '[]') {
      try {
        final decoded = jsonDecode(rawRoute) as List<dynamic>;
        routeCoords = decoded
            .map<List<double>>((pair) => [
                  _toDouble((pair as List<dynamic>)[0]),
                  _toDouble(pair[1]),
                ])
            .toList();
      } catch (_) {
        routeCoords = [];
      }
    }

    // ── Waypoints ──────────────────────────────────────────────
    // waypointsData is stored as a JSON string: "[{...},{...}]"
    List<WaypointModel> waypoints = [];
    final rawWaypoints = json['waypointsData'] as String?;
    if (rawWaypoints != null && rawWaypoints.isNotEmpty && rawWaypoints != '[]') {
      try {
        final decoded = jsonDecode(rawWaypoints) as List<dynamic>;
        waypoints = decoded
            .asMap()
            .entries
            .map((e) => WaypointModel.fromJson(
                  e.value as Map<String, dynamic>,
                  id: e.key.toString(),
                ))
            .toList();
      } catch (_) {
        waypoints = [];
      }
    }

    // ── User id ────────────────────────────────────────────────
    final userObj = json['user'] as Map<String, dynamic>?;
    final userId = userObj != null
        ? (userObj['id'] ?? 0).toString()
        : '0';

    return TripModel(
      id: (json['id'] ?? 0).toString(),
      userId: userId,
      title: json['title'] as String? ?? 'Untitled Trip',
      description: json['description'] as String? ?? '',
      status: json['status'] as String? ?? 'PLANNED',
      routeCoordinates: routeCoords,
      waypoints: waypoints,
      coverPhotoUrl: '',
      createdAt: DateTime.now(),  // Spring Boot entity has no createdAt field yet
      updatedAt: DateTime.now(),
    );
  }

  /// Serialize for POST /api/trips.
  Map<String, dynamic> toJson() {
    return {
      'userId': int.tryParse(userId) ?? 0,
      'title': title,
      'description': description,
      'status': status,
    };
  }

  /// Returns a copy of this TripModel with given fields overridden.
  TripModel copyWith({
    String? id,
    String? userId,
    String? title,
    String? description,
    String? status,
    List<List<double>>? routeCoordinates,
    List<WaypointModel>? waypoints,
    String? coverPhotoUrl,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return TripModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      description: description ?? this.description,
      status: status ?? this.status,
      routeCoordinates: routeCoordinates ?? this.routeCoordinates,
      waypoints: waypoints ?? this.waypoints,
      coverPhotoUrl: coverPhotoUrl ?? this.coverPhotoUrl,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  /// Convenience: total number of GPS points in the route
  int get totalTrackPoints => routeCoordinates.length;

  @override
  String toString() =>
      'TripModel(id: $id, title: $title, status: $status, waypoints: ${waypoints.length})';
}

// ─────────────────────────────────────────────────────────────

double _toDouble(dynamic v) {
  if (v is double) return v;
  if (v is int) return v.toDouble();
  if (v is String) return double.tryParse(v) ?? 0.0;
  return 0.0;
}
