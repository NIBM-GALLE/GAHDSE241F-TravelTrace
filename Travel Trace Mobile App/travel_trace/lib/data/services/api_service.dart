import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:travel_trace/data/models/auth_response_model.dart';
import 'package:travel_trace/data/models/user_model.dart';
import 'token_storage_service.dart';

class ApiService {
  // UPDATE THIS with your backend URL
  // For Android emulator: http://10.0.2.2:8080
  // For physical device: http://<your-machine-ip>:8080
  static const String baseUrl = 'http://10.0.2.2:3000/api/users';

  // Register new user
  static Future<AuthResponse> register({
    required String username,
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 201) {
        final json = jsonDecode(response.body);
        return AuthResponse(
          message: json['message'] ?? 'Registration successful',
          success: true,
        );
      } else if (response.statusCode == 400) {
        final json = jsonDecode(response.body);
        return AuthResponse.error(json['message'] ?? 'Registration failed');
      } else {
        return AuthResponse.error('Server error: ${response.statusCode}');
      }
    } catch (e) {
      return AuthResponse.error('Error: ${e.toString()}');
    }
  }

  // Login user
  static Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        final token = json['token'];
        final user = User.fromJson(json['user'] ?? {});

        // Save token and user locally
        if (token != null) {
          await TokenStorageService.saveToken(token);
          await TokenStorageService.saveUser(jsonEncode(user.toJson()));
        }

        return AuthResponse(
          token: token,
          user: user,
          success: token != null,
        );
      } else if (response.statusCode == 400) {
        final json = jsonDecode(response.body);
        return AuthResponse.error(json['message'] ?? 'Invalid credentials');
      } else {
        return AuthResponse.error('Server error: ${response.statusCode}');
      }
    } catch (e) {
      return AuthResponse.error('Error: ${e.toString()}');
    }
  }

  // Get user profile (requires token)
  static Future<User?> getUserProfile() async {
    try {
      final token = await TokenStorageService.getToken();
      if (token == null) return null;

      final response = await http.get(
        Uri.parse('$baseUrl/profile'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        return User.fromJson(json['data'] ?? {});
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  // Logout
  static Future<void> logout() async {
    await TokenStorageService.clearAuth();
  }
}
