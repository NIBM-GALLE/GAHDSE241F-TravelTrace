// lib/services/api_service.dart
// -----------------------------------------------------------
// HTTP client singleton for the TravelTrace Spring Boot REST API.
//
// Backend: Spring Boot + MySQL running on port 5000
// All endpoints are under /api/trips and /api/users.
//
// Responses are plain entity JSON (no { data: ... } wrapper).
//
// Configuration:
//   Android emulator  → baseUrl = 'http://10.0.2.2:5000/api'
//   Physical device   → replace with your machine's LAN IP
//                       e.g. 'http://192.168.1.5:5000/api'
// -----------------------------------------------------------

import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/trip_model.dart';

class ApiService {
  // ── Singleton ─────────────────────────────────────────────
  ApiService._internal();
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  // ── Base URL ──────────────────────────────────────────────
  // Android emulator → 10.0.2.2 maps to host localhost
  // Physical device  → use your LAN IP (e.g. 192.168.x.x)
  static const String baseUrl = 'http://192.168.43.62:5000/api';

  /// Shared JSON headers
  static const Map<String, String> _headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // ═══════════════════════════════════════════════════════════
  // USER ENDPOINTS
  // ═══════════════════════════════════════════════════════════

  // ── GET /api/users/{id} ───────────────────────────────────
  Future<Map<String, dynamic>> getUserById(String userId) async {
    final uri = Uri.parse('$baseUrl/users/$userId');
    final response = await http
        .get(uri, headers: _headers)
        .timeout(const Duration(seconds: 15));
    _assertSuccess(response, 'getUserById');
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  // ── POST /api/users ───────────────────────────────────────
  /// Register a new user account.
  /// Returns the created user map (id, username, email, phoneNumber, address).
  Future<Map<String, dynamic>> registerUser({
    required String username,
    required String email,
    required String password,
    required String phoneNumber,
    required String address,
  }) async {
    final uri = Uri.parse('$baseUrl/users');
    final response = await http
        .post(
          uri,
          headers: _headers,
          body: jsonEncode({
            'username': username,
            'email': email,
            'password': password,
            'phoneNumber': phoneNumber,
            'address': address,
          }),
        )
        .timeout(const Duration(seconds: 15));
    _assertSuccess(response, 'registerUser');
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  // ── POST /api/auth/login ──────────────────────────────────
  /// Authenticate a user by email + password.
  /// Returns the user map on success, throws ApiException on failure.
  Future<Map<String, dynamic>> loginUser({
    required String email,
    required String password,
  }) async {
    final uri = Uri.parse('$baseUrl/auth/login');
    final response = await http
        .post(
          uri,
          headers: _headers,
          body: jsonEncode({'email': email, 'password': password}),
        )
        .timeout(const Duration(seconds: 15));
    _assertSuccess(response, 'loginUser');
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  // ── GET /api/users/by-username/{username} ─────────────────
  Future<Map<String, dynamic>?> getUserByUsername(String username) async {
    final uri = Uri.parse('$baseUrl/users/by-username/$username');
    final response = await http
        .get(uri, headers: _headers)
        .timeout(const Duration(seconds: 15));
    if (response.statusCode == 404) return null;
    _assertSuccess(response, 'getUserByUsername');
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  // ═══════════════════════════════════════════════════════════
  // TRIP ENDPOINTS
  // ═══════════════════════════════════════════════════════════

  // ── GET /api/trips/user/{userId} ──────────────────────────
  /// Returns all trips for the given userId.
  /// Spring Boot returns a plain JSON array (no wrapper).
  Future<List<TripModel>> fetchUserTrips(String userId) async {
    final uri = Uri.parse('$baseUrl/trips/user/$userId');

    try {
      final response = await http
          .get(uri, headers: _headers)
          .timeout(const Duration(seconds: 15));

      _assertSuccess(response, 'fetchUserTrips');

      // Spring Boot returns a plain JSON array: [{...}, {...}]
      final List<dynamic> data = jsonDecode(response.body) as List<dynamic>;
      return data
          .map<TripModel>((j) => TripModel.fromJson(j as Map<String, dynamic>))
          .toList();
    } on SocketException {
      throw ApiException(
        'Cannot connect to server. Make sure the backend is running.',
        statusCode: 0,
      );
    } catch (e) {
      rethrow;
    }
  }

  // ── GET /api/trips/{id} ───────────────────────────────────
  Future<TripModel> getTripById(String tripId) async {
    final uri = Uri.parse('$baseUrl/trips/$tripId');

    final response = await http
        .get(uri, headers: _headers)
        .timeout(const Duration(seconds: 15));

    _assertSuccess(response, 'getTripById');
    return TripModel.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );
  }

  // ── POST /api/trips ───────────────────────────────────────
  /// Create a new trip.
  /// Body: { "userId": 1, "title": "...", "description": "...", "status": "PLANNED" }
  Future<TripModel> createTrip({
    required String userId,
    required String title,
    String description = '',
  }) async {
    final uri = Uri.parse('$baseUrl/trips');

    final response = await http
        .post(
          uri,
          headers: _headers,
          body: jsonEncode({
            'userId': int.parse(userId), // backend expects Long
            'title': title,
            'description': description,
            'status': 'PLANNED',
          }),
        )
        .timeout(const Duration(seconds: 15));

    _assertSuccess(response, 'createTrip');
    return TripModel.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );
  }

  // ── DELETE /api/trips/{id} ────────────────────────────────
  Future<void> deleteTrip(String tripId) async {
    final uri = Uri.parse('$baseUrl/trips/$tripId');

    final response = await http
        .delete(uri, headers: _headers)
        .timeout(const Duration(seconds: 15));

    _assertSuccess(response, 'deleteTrip');
  }

  // ── PUT /api/trips/{id}/track ─────────────────────────────
  /// Append a single GPS coordinate to the trip's route.
  /// Called on every position update during live tracking.
  /// Body: { "latitude": 1.3521, "longitude": 103.8198 }
  Future<void> updateLiveLocation({
    required String tripId,
    required double latitude,
    required double longitude,
  }) async {
    final uri = Uri.parse('$baseUrl/trips/$tripId/track');

    final response = await http
        .put(
          uri,
          headers: _headers,
          body: jsonEncode({'latitude': latitude, 'longitude': longitude}),
        )
        .timeout(const Duration(seconds: 10));

    _assertSuccess(response, 'updateLiveLocation');
  }

  // ── PUT /api/trips/{id}/waypoint ──────────────────────────
  /// Append a waypoint to a trip.
  /// Backend expects: { "waypointJson": "{\"lat\":1.35,\"lng\":103.82,...}" }
  Future<TripModel> addWaypoint({
    required String tripId,
    required Map<String, dynamic> waypointData,
  }) async {
    final uri = Uri.parse('$baseUrl/trips/$tripId/waypoint');

    // Serialize the waypoint map into a JSON string for the waypointJson field
    final waypointJsonStr = jsonEncode(waypointData);

    final response = await http
        .put(
          uri,
          headers: _headers,
          body: jsonEncode({'waypointJson': waypointJsonStr}),
        )
        .timeout(const Duration(seconds: 15));

    _assertSuccess(response, 'addWaypoint');
    return TripModel.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );
  }

  // ── PATCH /api/trips/{id}/status ─────────────────────────
  /// Update trip status. status should be 'PLANNED', 'ONGOING', or 'COMPLETED'.
  Future<TripModel> updateTripStatus({
    required String tripId,
    required String status,
  }) async {
    final uri = Uri.parse('$baseUrl/trips/$tripId/status');

    final response = await http
        .patch(
          uri,
          headers: _headers,
          body: jsonEncode({'status': status.toUpperCase()}),
        )
        .timeout(const Duration(seconds: 15));

    _assertSuccess(response, 'updateTripStatus');
    return TripModel.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );
  }

  // ─── Private Helpers ────────────────────────────────────────

  void _assertSuccess(http.Response response, String operation) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      String message = 'HTTP ${response.statusCode}';
      try {
        final body = jsonDecode(response.body);
        if (body is Map) {
          message = body['message']?.toString() ?? body.toString();
        } else if (body is String) {
          message = body;
        }
      } catch (_) {
        message = response.body.isNotEmpty ? response.body : message;
      }
      throw ApiException(
        '[$operation] $message',
        statusCode: response.statusCode,
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────

/// Custom exception carrying the HTTP status code.
class ApiException implements Exception {
  final String message;
  final int statusCode;

  const ApiException(this.message, {required this.statusCode});

  @override
  String toString() => 'ApiException($statusCode): $message';
}
