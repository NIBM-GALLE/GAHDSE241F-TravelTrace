// lib/controllers/trip_controller.dart
// -----------------------------------------------------------
// ChangeNotifier-based state manager for trip data and
// live GPS tracking.
//
// Responsibilities:
//   • Load and cache the user's trip list
//   • Create new trips
//   • Manage live GPS tracking (start/stop location streams)
//   • Append route coordinates to the active trip via API
//   • Add waypoints to the active trip
// -----------------------------------------------------------

import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';
import '../models/trip_model.dart';
import '../services/api_service.dart';

/// Describes the current state of an async operation.
enum LoadingState { idle, loading, success, error }

class TripController extends ChangeNotifier {
  // ── Dependencies ──────────────────────────────────────────
  final ApiService _api = ApiService();

  // ── State ─────────────────────────────────────────────────
  List<TripModel> _trips = [];
  TripModel? _activeTrip;
  LoadingState _loadingState = LoadingState.idle;
  String _errorMessage = '';
  bool _isTracking = false;

  // ── GPS Tracking ──────────────────────────────────────────
  StreamSubscription<Position>? _locationSubscription;
  Position? _currentPosition;

  // ── Getters ───────────────────────────────────────────────
  List<TripModel> get trips => List.unmodifiable(_trips);
  TripModel? get activeTrip => _activeTrip;
  LoadingState get loadingState => _loadingState;
  String get errorMessage => _errorMessage;
  bool get isTracking => _isTracking;
  bool get isLoading => _loadingState == LoadingState.loading;
  Position? get currentPosition => _currentPosition;

  // ═══════════════════════════════════════════════════════════
  // loadUserTrips
  // Fetches all trips for the given userId from the API and
  // updates the local trip list.
  // ═══════════════════════════════════════════════════════════
  Future<void> loadUserTrips(String userId) async {
    _setLoading();
    try {
      _trips = await _api.fetchUserTrips(userId);
      _setSuccess();
    } catch (e) {
      _setError(e.toString());
    }
  }

  // ═══════════════════════════════════════════════════════════
  // createTrip
  // Creates a new trip and inserts it at the top of the list.
  // ═══════════════════════════════════════════════════════════
  Future<TripModel?> createTrip({
    required String userId,
    required String title,
    String description = '',
    String province = '',
    String duration = '',
    List<String> tags = const [],
  }) async {
    _setLoading();
    try {
      final newTrip = await _api.createTrip(
        userId: userId,
        title: title,
        description: description,
        province: province,
        duration: duration,
        tags: tags,
      );
      _trips.insert(0, newTrip);
      _setSuccess();
      return newTrip;
    } catch (e) {
      _setError(e.toString());
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // setActiveTrip
  // Sets the trip that is currently open on the Map screen.
  // ═══════════════════════════════════════════════════════════
  void setActiveTrip(TripModel trip) {
    _activeTrip = trip;
    notifyListeners();
  }

  // ═══════════════════════════════════════════════════════════
  // addWaypoint
  // Adds a waypoint pin to the active trip and refreshes it.
  // ═══════════════════════════════════════════════════════════
  Future<bool> addWaypoint({
    required String name,
    required String note,
    required String photoUrl,
    required double latitude,
    required double longitude,
  }) async {
    if (_activeTrip == null) return false;

    try {
      // Backend stores waypoints as a JSON string — send flat lat/lng keys
      final updatedTrip = await _api.addWaypoint(
        tripId: _activeTrip!.id,
        waypointData: {
          'name': name,
          'note': note,
          'imageUrl': photoUrl,    // backend uses imageUrl key
          'lat': latitude,         // backend uses lat/lng keys
          'lng': longitude,
          'timestamp': DateTime.now().toIso8601String(),
        },
      );

      // Use the fresh TripModel returned by the backend
      _activeTrip = updatedTrip;
      _updateTripInList(_activeTrip!);
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // startTracking
  // Requests location permissions and begins a GPS position
  // stream. Each position update is sent to the backend and
  // appended to the active trip's route.
  // ═══════════════════════════════════════════════════════════
  Future<void> startTracking() async {
    if (_activeTrip == null) return;

    // ── Permission Check ────────────────────────────────────
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        _setError('Location permission denied. Enable it in device settings.');
        return;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      _setError('Location permission permanently denied. Open app settings.');
      return;
    }

    _isTracking = true;
    notifyListeners();

    // ── Location Stream ──────────────────────────────────────
    // Using a 10-metre distance filter to avoid flooding the API
    // with micro-updates when the user is stationary.
    const LocationSettings settings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 10, // metres
    );

    _locationSubscription =
        Geolocator.getPositionStream(locationSettings: settings)
            .listen((Position position) {
      _currentPosition = position;
      _appendRouteCoordinate(position.latitude, position.longitude);
      notifyListeners();
    });
  }

  // ═══════════════════════════════════════════════════════════
  // stopTracking
  // Cancels the GPS stream and marks the trip as 'completed'.
  // ═══════════════════════════════════════════════════════════
  Future<void> stopTracking() async {
    await _locationSubscription?.cancel();
    _locationSubscription = null;
    _isTracking = false;

    // Mark the trip completed on the backend
    if (_activeTrip != null) {
      try {
        final updated = await _api.updateTripStatus(
          tripId: _activeTrip!.id,
          status: 'COMPLETED',   // must match TripStatus enum name
        );
        _activeTrip = updated;
        _updateTripInList(updated);
      } catch (_) {
        // Silently fail status update — tracking stop is still confirmed
      }
    }

    notifyListeners();
  }

  // ═══════════════════════════════════════════════════════════
  // deleteTrip
  // ═══════════════════════════════════════════════════════════
  Future<bool> deleteTrip(String tripId) async {
    try {
      await _api.deleteTrip(tripId);
      _trips.removeWhere((t) => t.id == tripId);
      if (_activeTrip?.id == tripId) _activeTrip = null;
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // clearTrips
  // Resets all trip state — called on logout.
  // ═══════════════════════════════════════════════════════════
  void clearTrips() {
    _trips = [];
    _activeTrip = null;
    _loadingState = LoadingState.idle;
    _errorMessage = '';
    notifyListeners();
  }

  // ─── Private Helpers ────────────────────────────────────────

  /// Sends a single [lat, lng] coordinate to the backend.
  Future<void> _appendRouteCoordinate(double lat, double lng) async {
    if (_activeTrip == null) return;
    try {
      await _api.updateLiveLocation(
        tripId: _activeTrip!.id,
        latitude: lat,
        longitude: lng,
      );

      // Optimistically append coordinate to local model
      final updatedCoords = [
        ..._activeTrip!.routeCoordinates,
        [lng, lat],
      ];
      _activeTrip = _activeTrip!.copyWith(routeCoordinates: updatedCoords);
      _updateTripInList(_activeTrip!);
    } catch (_) {
      // Network hiccup — the local polyline still renders the point
    }
  }

  /// Replaces the trip in [_trips] list with the updated version.
  void _updateTripInList(TripModel updated) {
    final index = _trips.indexWhere((t) => t.id == updated.id);
    if (index != -1) {
      _trips[index] = updated;
    }
  }

  void _setLoading() {
    _loadingState = LoadingState.loading;
    _errorMessage = '';
    notifyListeners();
  }

  void _setSuccess() {
    _loadingState = LoadingState.success;
    notifyListeners();
  }

  void _setError(String message) {
    _loadingState = LoadingState.error;
    _errorMessage = message;
    notifyListeners();
  }

  @override
  void dispose() {
    _locationSubscription?.cancel();
    super.dispose();
  }
}
