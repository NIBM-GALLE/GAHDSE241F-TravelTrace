// lib/widgets/waypoint_dialog.dart
// -----------------------------------------------------------
// A modal bottom sheet form for adding a new waypoint to the
// active trip. Lets the user type a name, note, and pick a
// photo from camera/gallery (uploaded to Cloudinary), then
// captures the current GPS location and submits to API.
// -----------------------------------------------------------

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../controllers/trip_controller.dart';
import '../services/cloudinary_service.dart';

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

  // ── Photo state ────────────────────────────────────────────
  final ImagePicker _imagePicker = ImagePicker();
  File? _selectedImage;
  String? _uploadedPhotoUrl;
  bool _isUploading = false;

  // ── GPS state ──────────────────────────────────────────────
  double? _capturedLat;
  double? _capturedLng;
  bool _isFetchingLocation = false;
  bool _isSubmitting = false;
  String? _locationLabel;

  @override
  void dispose() {
    _nameController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  // ── Pick image from camera or gallery ─────────────────────
  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? pickedFile = await _imagePicker.pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (pickedFile == null) return; // User cancelled

      final file = File(pickedFile.path);
      setState(() {
        _selectedImage = file;
        _uploadedPhotoUrl = null; // Reset any previous upload
      });

      // Auto-upload to Cloudinary
      await _uploadToCloudinary(file);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Could not pick image: $e'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  // ── Upload to Cloudinary ──────────────────────────────────
  Future<void> _uploadToCloudinary(File file) async {
    setState(() => _isUploading = true);
    try {
      final url = await CloudinaryService().uploadImage(file);
      if (mounted) {
        setState(() {
          _uploadedPhotoUrl = url;
          _isUploading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isUploading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Upload failed: $e'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  // ── Remove selected photo ─────────────────────────────────
  void _removePhoto() {
    setState(() {
      _selectedImage = null;
      _uploadedPhotoUrl = null;
    });
  }

  // ── Show image source picker ──────────────────────────────
  void _showImageSourcePicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E2A3A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Add Photo',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 20),
              ListTile(
                leading: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFF6EE7F7).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.camera_alt_rounded,
                    color: Color(0xFF6EE7F7),
                    size: 22,
                  ),
                ),
                title: const Text(
                  'Take a Photo',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                subtitle: Text(
                  'Use your camera to capture a moment',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.4),
                    fontSize: 12,
                  ),
                ),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickImage(ImageSource.camera);
                },
              ),
              const Divider(
                color: Colors.white10,
                indent: 72,
                endIndent: 16,
              ),
              ListTile(
                leading: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFA78BFA).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.photo_library_rounded,
                    color: Color(0xFFA78BFA),
                    size: 22,
                  ),
                ),
                title: const Text(
                  'Choose from Gallery',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                subtitle: Text(
                  'Pick an existing photo from your device',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.4),
                    fontSize: 12,
                  ),
                ),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickImage(ImageSource.gallery);
                },
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
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

    // Wait if still uploading
    if (_isUploading) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please wait for the photo to finish uploading.'),
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
      photoUrl: _uploadedPhotoUrl ?? '',
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
        child: SingleChildScrollView(
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

              // ── Photo Upload Section ──────────────────────────
              _buildPhotoSection(),
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
      ),
    );
  }

  // ── Photo Upload Section Widget ──────────────────────────────
  Widget _buildPhotoSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Label
        Row(
          children: [
            Icon(Icons.cloud_upload_rounded,
                size: 16, color: Colors.white.withOpacity(0.5)),
            const SizedBox(width: 6),
            Text(
              'Photo',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
            const Spacer(),
            // Upload status badge
            if (_isUploading)
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFFBBF24).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(
                      width: 10,
                      height: 10,
                      child: CircularProgressIndicator(
                        strokeWidth: 1.5,
                        color: Color(0xFFFBBF24),
                      ),
                    ),
                    const SizedBox(width: 5),
                    const Text(
                      'Uploading…',
                      style: TextStyle(
                        color: Color(0xFFFBBF24),
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              )
            else if (_uploadedPhotoUrl != null)
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF34D399).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.check_circle_rounded,
                        size: 12, color: Color(0xFF34D399)),
                    SizedBox(width: 4),
                    Text(
                      'Uploaded',
                      style: TextStyle(
                        color: Color(0xFF34D399),
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
        const SizedBox(height: 10),

        // ── Image preview / Picker ──────────────────────────
        GestureDetector(
          onTap: (_isUploading) ? null : _showImageSourcePicker,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            width: double.infinity,
            height: _selectedImage != null ? 180 : 110,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: _uploadedPhotoUrl != null
                    ? const Color(0xFF34D399).withOpacity(0.4)
                    : _isUploading
                        ? const Color(0xFFFBBF24).withOpacity(0.4)
                        : Colors.white12,
                width: 1.5,
              ),
            ),
            clipBehavior: Clip.antiAlias,
            child: _selectedImage != null
                ? Stack(
                    fit: StackFit.expand,
                    children: [
                      // Image preview
                      Image.file(
                        _selectedImage!,
                        fit: BoxFit.cover,
                      ),

                      // Dark gradient overlay for buttons
                      Positioned.fill(
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.transparent,
                                Colors.black.withOpacity(0.6),
                              ],
                              stops: const [0.5, 1.0],
                            ),
                          ),
                        ),
                      ),

                      // Upload progress overlay
                      if (_isUploading)
                        Positioned.fill(
                          child: Container(
                            color: Colors.black45,
                            child: const Center(
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  SizedBox(
                                    width: 32,
                                    height: 32,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 3,
                                      color: Color(0xFF6EE7F7),
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  Text(
                                    'Uploading to Cloudinary…',
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                      // Remove button (top-right)
                      if (!_isUploading)
                        Positioned(
                          top: 8,
                          right: 8,
                          child: GestureDetector(
                            onTap: _removePhoto,
                            child: Container(
                              width: 30,
                              height: 30,
                              decoration: BoxDecoration(
                                color: Colors.black54,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(
                                Icons.close_rounded,
                                color: Colors.white70,
                                size: 18,
                              ),
                            ),
                          ),
                        ),

                      // Change photo hint (bottom)
                      if (!_isUploading)
                        Positioned(
                          bottom: 10,
                          left: 0,
                          right: 0,
                          child: Center(
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black45,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text(
                                'Tap to change photo',
                                style: TextStyle(
                                  color: Colors.white60,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  )
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: const Color(0xFF6EE7F7).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.add_a_photo_rounded,
                          color: Color(0xFF6EE7F7),
                          size: 22,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Tap to add a photo',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.5),
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        'Camera or Gallery • Uploaded to Cloudinary',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.25),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
          ),
        ),
      ],
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
