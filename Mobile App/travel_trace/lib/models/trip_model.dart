// lib/models/trip_model.dart
// -----------------------------------------------------------
// Dart data classes mirroring the Spring Boot / MySQL Trip entity.
//
// Spring Boot response shape:
// {
//   "id": 1,
//   "title": "Ella Hike",
//   "description": "...",
//   "status": "COMPLETED",
//   "province": "Uva Province",
//   "duration": "2 days",
//   "tags": "Hiking,Scenic",
//   "createdAt": "2024-04-02T06:00:00",
//   "routeData": "[[80.77,7.87],[80.78,7.88]]",
//   "waypointsData": "[{\"lat\":7.87,\"lng\":80.77,\"name\":\"...\"}]",
//   "user": { "id": 1, "username": "priya", "email": "..." }
// }
// -----------------------------------------------------------

import 'dart:convert';

/// A single waypoint pin — parsed from the waypointsData JSON string.
class WaypointModel {
  final String id; // synthetic index-based id
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

  factory WaypointModel.fromJson(Map<String, dynamic> json, {String id = ''}) {
    return WaypointModel(
      id: id,
      name: json['name'] as String? ?? 'Waypoint',
      note: json['note'] as String? ?? '',
      photoUrl: (json['imageUrl'] ?? json['photoUrl'] ?? '') as String,
      longitude: _toDouble(json['lng'] ?? json['longitude'] ?? 0),
      latitude: _toDouble(json['lat'] ?? json['latitude'] ?? 0),
      createdAt: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

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

/// Represents a full trip with route coords, waypoints, and metadata.
class TripModel {
  final String id;
  final String userId;
  final String username; // from user.username
  final String title;
  final String description;
  final String status; // 'PLANNED' | 'ONGOING' | 'COMPLETED'
  final String province; // e.g. "Uva Province"
  final String duration; // e.g. "2 days"
  final List<String> tags; // e.g. ["Hiking", "Scenic"]
  final List<List<double>> routeCoordinates; // [[lng, lat], ...]
  final List<WaypointModel> waypoints;
  final String coverPhotoUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  const TripModel({
    required this.id,
    required this.userId,
    required this.username,
    required this.title,
    required this.description,
    required this.status,
    required this.province,
    required this.duration,
    required this.tags,
    required this.routeCoordinates,
    required this.waypoints,
    required this.coverPhotoUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  /// Parse a TripModel from a Spring Boot entity JSON response.
  factory TripModel.fromJson(Map<String, dynamic> json) {
    // ── Route coordinates ──────────────────────────────────────
    List<List<double>> routeCoords = [];
    final rawRoute = json['routeData'] as String?;
    if (rawRoute != null && rawRoute.isNotEmpty && rawRoute != '[]') {
      try {
        final decoded = jsonDecode(rawRoute) as List<dynamic>;
        routeCoords = decoded
            .map<List<double>>(
              (pair) => [
                _toDouble((pair as List<dynamic>)[0]),
                _toDouble(pair[1]),
              ],
            )
            .toList();
      } catch (_) {
        routeCoords = [];
      }
    }

    // ── Waypoints ──────────────────────────────────────────────
    List<WaypointModel> waypoints = [];
    final rawWaypoints = json['waypointsData'] as String?;
    if (rawWaypoints != null &&
        rawWaypoints.isNotEmpty &&
        rawWaypoints != '[]') {
      try {
        final decoded = jsonDecode(rawWaypoints) as List<dynamic>;
        waypoints = decoded
            .asMap()
            .entries
            .map(
              (e) => WaypointModel.fromJson(
                e.value as Map<String, dynamic>,
                id: e.key.toString(),
              ),
            )
            .toList();
      } catch (_) {
        waypoints = [];
      }
    }

    // ── Tags — stored as comma-separated string ────────────────
    final rawTags = json['tags'] as String? ?? '';
    final tags = rawTags.isNotEmpty
        ? rawTags.split(',').map((t) => t.trim()).where((t) => t.isNotEmpty).toList()
        : <String>[];

    // ── User ───────────────────────────────────────────────────
    final userObj = json['user'] as Map<String, dynamic>?;
    final userId = userObj != null ? (userObj['id'] ?? 0).toString() : '0';
    final username = userObj != null ? (userObj['username'] ?? '') as String : '';

    // ── createdAt ──────────────────────────────────────────────
    final rawCreatedAt = json['createdAt'] as String?;
    final createdAt = rawCreatedAt != null
        ? DateTime.tryParse(rawCreatedAt) ?? DateTime.now()
        : DateTime.now();

    return TripModel(
      id: (json['id'] ?? 0).toString(),
      userId: userId,
      username: username,
      title: json['title'] as String? ?? 'Untitled Trip',
      description: json['description'] as String? ?? '',
      status: json['status'] as String? ?? 'PLANNED',
      province: json['province'] as String? ?? '',
      duration: json['duration'] as String? ?? '',
      tags: tags,
      routeCoordinates: routeCoords,
      waypoints: waypoints,
      coverPhotoUrl: '',
      createdAt: createdAt,
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
      'province': province,
      'duration': duration,
      'tags': tags.join(','),
    };
  }

  TripModel copyWith({
    String? id,
    String? userId,
    String? username,
    String? title,
    String? description,
    String? status,
    String? province,
    String? duration,
    List<String>? tags,
    List<List<double>>? routeCoordinates,
    List<WaypointModel>? waypoints,
    String? coverPhotoUrl,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return TripModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      username: username ?? this.username,
      title: title ?? this.title,
      description: description ?? this.description,
      status: status ?? this.status,
      province: province ?? this.province,
      duration: duration ?? this.duration,
      tags: tags ?? this.tags,
      routeCoordinates: routeCoordinates ?? this.routeCoordinates,
      waypoints: waypoints ?? this.waypoints,
      coverPhotoUrl: coverPhotoUrl ?? this.coverPhotoUrl,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  int get totalTrackPoints => routeCoordinates.length;

  @override
  String toString() =>
      'TripModel(id: $id, title: $title, status: $status, province: $province, duration: $duration, tags: $tags, waypoints: ${waypoints.length})';
}

// ─────────────────────────────────────────────────────────────

double _toDouble(dynamic v) {
  if (v is double) return v;
  if (v is int) return v.toDouble();
  if (v is String) return double.tryParse(v) ?? 0.0;
  return 0.0;
}
