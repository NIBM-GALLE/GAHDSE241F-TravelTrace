// lib/screens/map_screen.dart
// -----------------------------------------------------------
// Interactive map screen powered by flutter_map + OpenStreetMap.
//
// Features:
//   • Renders the trip's GPS route as a blue Polyline
//   • Places custom Marker pins for every waypoint
//   • Tapping a marker shows a popup with name, note, and photo
//   • FAB to add a new waypoint (opens WaypointDialog)
//   • FAB to start/stop live GPS tracking
//   • Auto-centers map on the last recorded position when tracking
// -----------------------------------------------------------

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import '../controllers/trip_controller.dart';
import '../models/trip_model.dart';
import '../widgets/waypoint_dialog.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();

  // Default center: Sri Lanka geographic center. Will zoom to route if data exists.
  static const LatLng _defaultCenter = LatLng(7.8731, 80.7718);
  static const double _defaultZoom = 7.5;
  static const double _trackingZoom = 15.0;

  /// Selected waypoint for the popup panel
  WaypointModel? _selectedWaypoint;

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  // ── Pan map to a coordinate ────────────────────────────────
  void _moveTo(LatLng point, {double zoom = 14.0}) {
    _mapController.move(point, zoom);
  }

  // ── Build PolylineLayer from route coordinates ─────────────
  PolylineLayer _buildPolylineLayer(List<List<double>> coords) {
    if (coords.isEmpty) return const PolylineLayer(polylines: []);

    final points =
        coords.map((c) => LatLng(c[1], c[0])).toList(); // [lng, lat] → LatLng

    return PolylineLayer(
      polylines: [
        Polyline(
          points: points,
          color: const Color(0xFF6EE7F7),
          strokeWidth: 4.0,
          // Dashed stroke can be achieved with a custom painter if needed
        ),
      ],
    );
  }

  // ── Build MarkerLayer from waypoints ──────────────────────
  MarkerLayer _buildMarkerLayer(List<WaypointModel> waypoints) {
    return MarkerLayer(
      markers: waypoints.map((wp) {
        final latLng = LatLng(wp.latitude, wp.longitude);
        return Marker(
          point: latLng,
          width: 44,
          height: 52,
          child: GestureDetector(
            onTap: () {
              setState(() => _selectedWaypoint = wp);
              _moveTo(latLng);
            },
            child: Column(
              children: [
                // Pin head
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFFA78BFA),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFA78BFA).withOpacity(0.5),
                        blurRadius: 10,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.location_on_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                // Pin tail
                Container(
                  width: 3,
                  height: 10,
                  color: const Color(0xFFA78BFA),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  // ── Waypoint info popup ────────────────────────────────────
  Widget _buildWaypointPopup(WaypointModel wp) {
    return Positioned(
      bottom: 120,
      left: 16,
      right: 16,
      child: Material(
        elevation: 12,
        borderRadius: BorderRadius.circular(20),
        color: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF1E2A3A),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: const Color(0xFFA78BFA).withOpacity(0.3),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  const Icon(Icons.location_on_rounded,
                      color: Color(0xFFA78BFA), size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      wp.name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 16,
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => setState(() => _selectedWaypoint = null),
                    child: const Icon(Icons.close_rounded,
                        color: Colors.white38, size: 20),
                  ),
                ],
              ),
              if (wp.note.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(
                  wp.note,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 13,
                  ),
                ),
              ],
              if (wp.photoUrl.isNotEmpty) ...[
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(
                    wp.photoUrl,
                    height: 140,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      height: 80,
                      color: Colors.white.withOpacity(0.05),
                      child: const Center(
                        child: Icon(Icons.broken_image_rounded,
                            color: Colors.white24),
                      ),
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 8),
              Text(
                '${wp.latitude.toStringAsFixed(5)}, ${wp.longitude.toStringAsFixed(5)}',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.3),
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A1628),
      body: Consumer<TripController>(
        builder: (context, controller, _) {
          final trip = controller.activeTrip;
          if (trip == null) {
            return const Center(
              child: Text('No active trip',
                  style: TextStyle(color: Colors.white54)),
            );
          }

          // Determine initial map position from route or waypoints
          LatLng mapCenter = _defaultCenter;
          double mapZoom = _defaultZoom;

          if (trip.routeCoordinates.isNotEmpty) {
            final last = trip.routeCoordinates.last;
            mapCenter = LatLng(last[1], last[0]);
            mapZoom = 13.0;
          } else if (trip.waypoints.isNotEmpty) {
            final first = trip.waypoints.first;
            mapCenter = LatLng(first.latitude, first.longitude);
            mapZoom = 13.0;
          }

          return Stack(
            children: [
              // ── Map ─────────────────────────────────────────
              FlutterMap(
                mapController: _mapController,
                options: MapOptions(
                  initialCenter: mapCenter,
                  initialZoom: mapZoom,
                  onTap: (_, __) =>
                      setState(() => _selectedWaypoint = null),
                ),
                children: [
                  // OpenStreetMap tile layer — free, no API key
                  TileLayer(
                    urlTemplate:
                        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.traveltrace.app',
                  ),

                  // Route polyline
                  _buildPolylineLayer(trip.routeCoordinates),

                  // Waypoint markers
                  _buildMarkerLayer(trip.waypoints),

                  // Current GPS position marker (during tracking)
                  if (controller.isTracking &&
                      controller.currentPosition != null)
                    MarkerLayer(
                      markers: [
                        Marker(
                          point: LatLng(
                            controller.currentPosition!.latitude,
                            controller.currentPosition!.longitude,
                          ),
                          width: 24,
                          height: 24,
                          child: Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFF34D399),
                              shape: BoxShape.circle,
                              border: Border.all(
                                  color: Colors.white, width: 3),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF34D399)
                                      .withOpacity(0.5),
                                  blurRadius: 12,
                                  spreadRadius: 4,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                ],
              ),

              // ── Top Bar ──────────────────────────────────────
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: Container(
                  padding: EdgeInsets.only(
                    top: MediaQuery.of(context).padding.top + 8,
                    left: 16,
                    right: 16,
                    bottom: 12,
                  ),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        const Color(0xFF0A1628).withOpacity(0.95),
                        const Color(0xFF0A1628).withOpacity(0.0),
                      ],
                    ),
                  ),
                  child: Row(
                    children: [
                      // Back button
                      GestureDetector(
                        onTap: () {
                          if (controller.isTracking) {
                            controller.stopTracking();
                          }
                          Navigator.pop(context);
                        },
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E2A3A),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.white12),
                          ),
                          child: const Icon(Icons.arrow_back_ios_new_rounded,
                              color: Colors.white70, size: 18),
                        ),
                      ),
                      const SizedBox(width: 12),

                      // Trip info
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              trip.title,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 16,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              '${trip.waypoints.length} pins • ${trip.totalTrackPoints} GPS points',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.45),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Tracking status indicator
                      if (controller.isTracking)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: const Color(0xFF34D399).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: const Color(0xFF34D399).withOpacity(0.4),
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 7,
                                height: 7,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF34D399),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 5),
                              const Text(
                                'LIVE',
                                style: TextStyle(
                                  color: Color(0xFF34D399),
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 1,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),

              // ── Waypoint Popup ───────────────────────────────
              if (_selectedWaypoint != null)
                _buildWaypointPopup(_selectedWaypoint!),

              // ── FABs ─────────────────────────────────────────
              Positioned(
                bottom: 32,
                right: 16,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    // Add Waypoint FAB
                    FloatingActionButton(
                      heroTag: 'add_waypoint',
                      onPressed: () => showAddWaypointDialog(context),
                      backgroundColor: const Color(0xFF1E2A3A),
                      child: const Icon(Icons.add_location_alt_rounded,
                          color: Color(0xFF6EE7F7)),
                    ),
                    const SizedBox(height: 12),

                    // Start/Stop Tracking FAB
                    FloatingActionButton.extended(
                      heroTag: 'tracking',
                      onPressed: () async {
                        if (controller.isTracking) {
                          await controller.stopTracking();
                        } else {
                          await controller.startTracking();
                          // Pan to current position when tracking starts
                          if (controller.currentPosition != null) {
                            _moveTo(
                              LatLng(
                                controller.currentPosition!.latitude,
                                controller.currentPosition!.longitude,
                              ),
                              zoom: _trackingZoom,
                            );
                          }
                        }
                      },
                      backgroundColor: controller.isTracking
                          ? const Color(0xFF34D399)
                          : const Color(0xFFA78BFA),
                      foregroundColor: Colors.white,
                      icon: Icon(
                        controller.isTracking
                            ? Icons.stop_rounded
                            : Icons.play_arrow_rounded,
                      ),
                      label: Text(
                        controller.isTracking ? 'Stop' : 'Track',
                        style: const TextStyle(fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
