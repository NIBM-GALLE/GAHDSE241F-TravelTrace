// lib/controllers/auth_controller.dart
// -----------------------------------------------------------
// ChangeNotifier-based state manager for user authentication.
//
// Responsibilities:
//   • Hold the currently logged-in UserModel (null = logged out)
//   • Register a new account via POST /api/users
//   • Login via POST /api/auth/login
//   • Logout (clears in-memory state)
// -----------------------------------------------------------

import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

/// Describes the current auth operation state.
enum AuthState { idle, loading, success, error }

class AuthController extends ChangeNotifier {
  // ── Dependencies ──────────────────────────────────────────
  final ApiService _api = ApiService();

  // ── State ─────────────────────────────────────────────────
  UserModel? _currentUser;
  AuthState _authState = AuthState.idle;
  String _errorMessage = '';

  // ── Getters ───────────────────────────────────────────────
  UserModel? get currentUser => _currentUser;
  AuthState get authState => _authState;
  String get errorMessage => _errorMessage;
  bool get isLoggedIn => _currentUser != null;
  bool get isLoading => _authState == AuthState.loading;

  // ═══════════════════════════════════════════════════════════
  // register
  // Creates a new user account and auto-logs in on success.
  // ═══════════════════════════════════════════════════════════
  Future<bool> register({
    required String username,
    required String email,
    required String password,
    required String phoneNumber,
    required String address,
  }) async {
    _setLoading();
    try {
      final userData = await _api.registerUser(
        username: username,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        address: address,
      );
      _currentUser = UserModel.fromJson(userData);
      _setSuccess();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // login
  // Authenticates an existing user by email + password.
  // ═══════════════════════════════════════════════════════════
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    _setLoading();
    try {
      final userData = await _api.loginUser(
        email: email,
        password: password,
      );
      _currentUser = UserModel.fromJson(userData);
      _setSuccess();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // logout
  // Clears the current user session.
  // ═══════════════════════════════════════════════════════════
  void logout() {
    _currentUser = null;
    _authState = AuthState.idle;
    _errorMessage = '';
    notifyListeners();
  }

  // ── Private Helpers ──────────────────────────────────────

  void _setLoading() {
    _authState = AuthState.loading;
    _errorMessage = '';
    notifyListeners();
  }

  void _setSuccess() {
    _authState = AuthState.success;
    notifyListeners();
  }

  void _setError(String message) {
    _authState = AuthState.error;
    _errorMessage = message;
    notifyListeners();
  }
}
