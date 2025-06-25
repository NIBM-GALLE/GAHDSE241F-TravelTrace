import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:path_provider/path_provider.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:path/path.dart' as path;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';

class TrailService {
  static String get baseUrl {
    // Use localhost for web, 10.0.2.2 for Android emulator
    return kIsWeb ? 'http://localhost:8080/api' : 'http://10.0.2.2:3000/api';
  }
  final _storage = const FlutterSecureStorage();
  
  Future<Map<String, dynamic>> createTrail({
    required String name,
    required String description,
    required String category,
    required LatLng startLocation,
    required LatLng endLocation,
    required DateTime date,
    required TimeOfDay time,
    List<Map<String, dynamic>>? specialPoints,
    File? photoFile,
    File? videoFile,
  }) async {
    try {
      final token = await _storage.read(key: 'auth_token');
      
      if (token == null) {
        return {
          'success': false,
          'message': 'User not authenticated',
        };
      }

      var uri = Uri.parse('$baseUrl/trails');
      var request = http.MultipartRequest('POST', uri);
      
      // Add headers
      request.headers.addAll({
        'Authorization': 'Bearer $token',
      });

      // Add text fields
      request.fields['name'] = name;
      request.fields['description'] = description;
      request.fields['category'] = category;
      request.fields['start_lat'] = startLocation.latitude.toString();
      request.fields['start_lng'] = startLocation.longitude.toString();
      request.fields['end_lat'] = endLocation.latitude.toString();
      request.fields['end_lng'] = endLocation.longitude.toString();
      request.fields['trail_date'] = date.toIso8601String();
      request.fields['trail_time'] = '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';

      if (specialPoints != null) {
        request.fields['special_points'] = json.encode(specialPoints);
      }

      // Add photo file if exists
      if (photoFile != null) {
        final mimeType = lookupMimeType(photoFile.path);
        if (mimeType != null && mimeType.startsWith('image/')) {
          final stream = http.ByteStream(photoFile.openRead());
          final length = await photoFile.length();
          final multipartFile = http.MultipartFile(
            'photo',
            stream,
            length,
            filename: path.basename(photoFile.path),
            contentType: MediaType.parse(mimeType),
          );
          request.files.add(multipartFile);
        }
      }

      // Add video file if exists
      if (videoFile != null) {
        final mimeType = lookupMimeType(videoFile.path);
        if (mimeType != null && mimeType.startsWith('video/')) {
          final stream = http.ByteStream(videoFile.openRead());
          final length = await videoFile.length();
          final multipartFile = http.MultipartFile(
            'video',
            stream,
            length,
            filename: path.basename(videoFile.path),
            contentType: MediaType.parse(mimeType),
          );
          request.files.add(multipartFile);
        }
      }

      // Send the request
      final response = await request.send();
      final responseString = await response.stream.bytesToString();
      final responseData = json.decode(responseString);

      if (response.statusCode == 201) {
        // Save trail data locally
        await saveTrailLocally(responseData['data']);
        
        return {
          'success': true,
          'data': responseData['data'],
        };
      } else {
        return {
          'success': false,
          'message': responseData['message'] ?? 'Failed to create trail',
        };
      }
    } catch (e) {
      print('Error creating trail: $e');
      return {
        'success': false,
        'message': 'Error creating trail: ${e.toString()}',
      };
    }
  }

  // Get user's trails
  Future<List<Map<String, dynamic>>> getUserTrails() async {
    try {
      final token = await _storage.read(key: 'auth_token');
      if (token == null) {
        return [];
      }

      final response = await http.get(
        Uri.parse('$baseUrl/trails/user'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data);
      }
      return [];
    } catch (e) {
      print('Error getting user trails: $e');
      return [];
    }
  }

  // Save trail data locally
  Future<void> saveTrailLocally(Map<String, dynamic> trailData) async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final file = File('${directory.path}/trails.json');
      
      List<Map<String, dynamic>> trails = [];
      
      if (await file.exists()) {
        final contents = await file.readAsString();
        trails = List<Map<String, dynamic>>.from(json.decode(contents));
      }
      
      trails.add(trailData);
      await file.writeAsString(json.encode(trails));
    } catch (e) {
      print('Error saving trail locally: $e');
    }
  }

  // Get locally saved trails
  Future<List<Map<String, dynamic>>> getLocalTrails() async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final file = File('${directory.path}/trails.json');
      
      if (await file.exists()) {
        final contents = await file.readAsString();
        return List<Map<String, dynamic>>.from(json.decode(contents));
      }
      
      return [];
    } catch (e) {
      print('Error getting local trails: $e');
      return [];
    }
  }

  // Get all trails
  Future<List<Map<String, dynamic>>> getAllTrails() async {
    try {
      final token = await _storage.read(key: 'auth_token');
      if (token == null) {
        return [];
      }

      final response = await http.get(
        Uri.parse('$baseUrl/trails'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data);
      }
      return [];
    } catch (e) {
      print('Error getting all trails: $e');
      return [];
    }
  }
} 