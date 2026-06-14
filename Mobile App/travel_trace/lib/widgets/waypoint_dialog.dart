// lib/widgets/waypoint_dialog.dart
// -----------------------------------------------------------
// A modal bottom sheet form for adding a new waypoint to the
// active trip. Lets the user type a name, note, and photo URL,
// then captures the current GPS location and submits to API.
// -----------------------------------------------------------

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:provider/provider.dart';
import '../controllers/trip_controller.dart';

/// Shows the Add Waypoint bottom sheet.
/// Call this from the Map screen FAB.
Future<void> showAddWaypointDialog(BuildContext context) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true, // allows full-height sheet
    backgroundColor: Colors.transparent,
    builder: (_) => const _WaypointDialogContent(),
  );
}

class _WaypointDialogContent extends StatefulWidget {
  const _WaypointDialogContent();

  @override
  State<_WaypointDialogContent> createState() => _WaypointDialogContentState();
}

class _WaypointDialogContentState extends State<_WaypointDialogContent> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _noteController = TextEditingController();
  final _photoController = TextEditingController();

  double? _capturedLat;
  double? _capturedLng;
  bool _isFetchingLocation = false;
  bool _isSubmitting = false;
  String? _locationLabel;

  @override
  void dispose() {
    _nameController.dispose();
    _noteController.dispose();
    _photoController.dispose();
    super.dispose();
  }

  // ── Fetch current GPS position ─────────────────────────────
  Future<void> _captureLocation() async {
    setState(() => _isFetchingLocation = true);
    try {
      // Permissions assumed already granted (checked in controller)
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
        ),
      );
      setState(() {
        _capturedLat = position.latitude;
        _capturedLng = position.longitude;
        _locationLabel =
            '${position.latitude.toStringAsFixed(5)}, ${position.longitude.toStringAsFixed(5)}';
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Could not get location: $e'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isFetchingLocation = false);
    }
  }

  // ── Submit waypoint ────────────────────────────────────────
  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_capturedLat == null || _capturedLng == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please capture your GPS location first.'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final controller = context.read<TripController>();
    final success = await controller.addWaypoint(
      name: _nameController.text.trim(),
      note: _noteController.text.trim(),
      photoUrl: _photoController.text.trim(),
      latitude: _capturedLat!,
      longitude: _capturedLng!,
    );

    if (mounted) {
      setState(() => _isSubmitting = false);
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('📍 Waypoint added!'),
            backgroundColor: Color(0xFF34D399),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(controller.errorMessage),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Shift sheet up when keyboard appears
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Container(
      padding: EdgeInsets.fromLTRB(24, 24, 24, 24 + bottomInset),
      decoration: const BoxDecoration(
        color: Color(0xFF16202E),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Handle ──────────────────────────────────────
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // ── Title ────────────────────────────────────────
            const Text(
              'Add Waypoint',
              style: TextStyle(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Drop a pin on your journey with a note and photo.',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 28),

            // ── Name Field ───────────────────────────────────
            _buildField(
              controller: _nameController,
              label: 'Waypoint Name',
              hint: 'e.g. Eiffel Tower',
              icon: Icons.flag_rounded,
              validator: (v) =>
                  v == null || v.trim().isEmpty ? 'Name is required' : null,
            ),
            const SizedBox(height: 16),

            // ── Note Field ───────────────────────────────────
            _buildField(
              controller: _noteController,
              label: 'Note',
              hint: 'What happened here?',
              icon: Icons.notes_rounded,
              maxLines: 3,
            ),
            const SizedBox(height: 16),

            // ── Photo URL Field ──────────────────────────────
            _buildField(
              controller: _photoController,
              label: 'Photo URL',
              hint: 'https://example.com/photo.jpg',
              icon: Icons.image_rounded,
              keyboardType: TextInputType.url,
            ),
            const SizedBox(height: 24),

            // ── GPS Location Capture ─────────────────────────
            GestureDetector(
              onTap: _isFetchingLocation ? null : _captureLocation,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: _capturedLat != null
                      ? const Color(0xFF34D399).withOpacity(0.1)
                      : Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: _capturedLat != null
                        ? const Color(0xFF34D399).withOpacity(0.4)
                        : Colors.white12,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      _capturedLat != null
                          ? Icons.gps_fixed_rounded
                          : Icons.gps_not_fixed_rounded,
                      color: _capturedLat != null
                          ? const Color(0xFF34D399)
                          : Colors.white38,
                      size: 22,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _capturedLat != null
                                ? 'Location Captured'
                                : 'Use Current Location',
                            style: TextStyle(
                              color: _capturedLat != null
                                  ? const Color(0xFF34D399)
                                  : Colors.white70,
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                          if (_locationLabel != null)
                            Text(
                              _locationLabel!,
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.45),
                                fontSize: 11,
                              ),
                            ),
                        ],
                      ),
                    ),
                    if (_isFetchingLocation)
                      const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Color(0xFF34D399),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 28),

            // ── Submit Button ────────────────────────────────
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6EE7F7),
                  foregroundColor: const Color(0xFF0A1628),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                child: _isSubmitting
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          color: Color(0xFF0A1628),
                        ),
                      )
                    : const Text(
                        'Add Waypoint',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    int maxLines = 1,
    String? Function(String?)? validator,
    TextInputType? keyboardType,
  }) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      validator: validator,
      keyboardType: keyboardType,
      style: const TextStyle(color: Colors.white, fontSize: 14),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(icon, size: 18, color: Colors.white38),
        labelStyle: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13),
        hintStyle: TextStyle(color: Colors.white.withOpacity(0.25), fontSize: 13),
        filled: true,
        fillColor: Colors.white.withOpacity(0.05),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Colors.white12),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Colors.white12),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFF6EE7F7), width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Colors.redAccent),
        ),
      ),
    );
  }
}
