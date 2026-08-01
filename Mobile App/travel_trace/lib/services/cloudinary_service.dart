// lib/services/cloudinary_service.dart
// -----------------------------------------------------------
// Uploads images directly to Cloudinary via their unsigned
// upload REST endpoint.
//
// Reads CLOUDINARY_CLOUD_NAME from .env (loaded via flutter_dotenv).
// Uses an unsigned upload preset named 'travel_trace_unsigned'
// — this preset must be created in the Cloudinary dashboard.
// -----------------------------------------------------------

import 'dart:convert';
import 'dart:io';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class CloudinaryService {
  // ── Singleton ─────────────────────────────────────────────
  CloudinaryService._internal();
  static final CloudinaryService _instance = CloudinaryService._internal();
  factory CloudinaryService() => _instance;

  // ── Configuration ──────────────────────────────────────────
  /// Cloudinary cloud name from .env
  String get _cloudName => dotenv.env['CLOUDINARY_CLOUD_NAME'] ?? '';

  /// Unsigned upload preset — must exist in your Cloudinary dashboard
  /// (Settings → Upload → Upload Presets → Add Unsigned Preset)
  static const String _uploadPreset = 'travel_trace_unsigned';

  /// Upload endpoint
  String get _uploadUrl =>
      'https://api.cloudinary.com/v1_1/$_cloudName/image/upload';

  // ── Upload ─────────────────────────────────────────────────
  /// Uploads an image [file] to Cloudinary and returns the
  /// secure CDN URL on success, or throws an exception on failure.
  Future<String> uploadImage(File file) async {
    if (_cloudName.isEmpty) {
      throw CloudinaryException(
        'CLOUDINARY_CLOUD_NAME not found in .env file.',
      );
    }

    try {
      final request = http.MultipartRequest('POST', Uri.parse(_uploadUrl));

      // Add the image file
      request.files.add(
        await http.MultipartFile.fromPath('file', file.path),
      );

      // Unsigned upload — requires the preset name
      request.fields['upload_preset'] = _uploadPreset;

      // Optional: organize uploads in a folder
      request.fields['folder'] = 'travel_trace/waypoints';

      final streamedResponse = await request.send().timeout(
        const Duration(seconds: 30),
      );

      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body) as Map<String, dynamic>;
        final secureUrl = body['secure_url'] as String?;
        if (secureUrl == null || secureUrl.isEmpty) {
          throw CloudinaryException(
            'Upload succeeded but no secure_url returned.',
          );
        }
        return secureUrl;
      } else {
        // Try to extract Cloudinary error message
        String errorMsg = 'HTTP ${response.statusCode}';
        try {
          final body = jsonDecode(response.body) as Map<String, dynamic>;
          final error = body['error'] as Map<String, dynamic>?;
          errorMsg = error?['message'] as String? ?? errorMsg;
        } catch (_) {}
        throw CloudinaryException('Upload failed: $errorMsg');
      }
    } on SocketException {
      throw CloudinaryException(
        'Network error — check your internet connection.',
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────

/// Custom exception for Cloudinary upload failures.
class CloudinaryException implements Exception {
  final String message;
  const CloudinaryException(this.message);

  @override
  String toString() => 'CloudinaryException: $message';
}
