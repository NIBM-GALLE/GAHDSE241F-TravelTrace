import 'user_model.dart';

class AuthResponse {
  final String? token;
  final User? user;
  final String? message;
  final bool success;

  AuthResponse({
    this.token,
    this.user,
    this.message,
    this.success = false,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'],
      user: json['user'] != null ? User.fromJson(json['user']) : null,
      message: json['message'],
      success: json['token'] != null || json['message'] != null,
    );
  }

  factory AuthResponse.error(String message) {
    return AuthResponse(
      message: message,
      success: false,
    );
  }
}
