import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:path/path.dart' as path;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';

class UserService {
  static String get baseUrl {
    // Use localhost for web, 10.0.2.2 for Android emulator
    return kIsWeb ? 'http://localhost:8080/api' : 'http://10.0.2.2:3000/api';
  }
  final _storage = const FlutterSecureStorage();

  // Store user data after login
  Future<void> storeUserData(Map<String, dynamic> userData, String token) async {
    await _storage.write(key: 'auth_token', value: token);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_data', json.encode(userData));
  }

  // Get stored user data
  Future<Map<String, dynamic>?> getStoredUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString('user_data');
    if (userDataString != null) {
      return json.decode(userDataString);
    }
    return null;
  }

  // Get user profile
  Future<Map<String, dynamic>> getUserProfile() async {
    try {
      final token = await _storage.read(key: 'auth_token');
      if (token == null) {
        return {
          'success': false,
          'message': 'User not authenticated',
        };
      }

      final response = await http.get(
        Uri.parse('$baseUrl/users/profile'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200) {
        await _storage.write(key: 'user_profile', value: json.encode(data));
        return {
          'success': true,
          'data': data,
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to get user profile',
        };
      }
    } catch (e) {
      print('Error getting user profile: $e');
      return {
        'success': false,
        'message': 'Error getting user profile: ${e.toString()}',
      };
    }
  }

  Future<Map<String, dynamic>?> getCachedProfile() async {
    try {
      final profileJson = await _storage.read(key: 'user_profile');
      if (profileJson != null) {
        return json.decode(profileJson);
      }
      return null;
    } catch (e) {
      print('Error getting cached profile: $e');
      return null;
    }
  }

  Future<Map<String, dynamic>> updateProfileField({
    String? username,
    String? email,
    String? bio,
  }) async {
    try {
      final token = await _storage.read(key: 'auth_token');
      if (token == null) {
        return {
          'success': false,
          'message': 'User not authenticated',
        };
      }

      final response = await http.patch(
        Uri.parse('$baseUrl/users/profile'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          if (username != null) 'username': username,
          if (email != null) 'email': email,
          if (bio != null) 'bio': bio,
        }),
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200) {
        await _storage.write(key: 'user_profile', value: json.encode(data));
        return {
          'success': true,
          'data': data,
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to update profile',
        };
      }
    } catch (e) {
      print('Error updating profile: $e');
      return {
        'success': false,
        'message': 'Error updating profile: ${e.toString()}',
      };
    }
  }

  Future<Map<String, dynamic>> updateProfileImage(File imageFile) async {
    try {
      final token = await _storage.read(key: 'auth_token');
      if (token == null) {
        return {
          'success': false,
          'message': 'User not authenticated',
        };
      }

      final mimeType = lookupMimeType(imageFile.path);
      if (mimeType == null || !mimeType.startsWith('image/')) {
        return {
          'success': false,
          'message': 'Invalid image file',
        };
      }

      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/users/profile/image'),
      );

      request.headers['Authorization'] = 'Bearer $token';

      request.files.add(
        await http.MultipartFile.fromPath(
          'profile_image',
          imageFile.path,
          contentType: MediaType.parse(mimeType),
        ),
      );

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        await _storage.write(key: 'user_profile', value: json.encode(data));
        return {
          'success': true,
          'data': data,
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to update profile image',
        };
      }
    } catch (e) {
      print('Error updating profile image: $e');
      return {
        'success': false,
        'message': 'Error updating profile image: ${e.toString()}',
      };
    }
  }

  // Clear all stored data on logout
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    await _storage.deleteAll();
  }
} 