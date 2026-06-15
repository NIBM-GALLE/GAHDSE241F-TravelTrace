// lib/screens/login_screen.dart
// -----------------------------------------------------------
// Full-screen login form.
// Fields: Email, Password.
// On success, pops back to HomeScreen with user logged in.
// Links to RegisterScreen for new users.
// -----------------------------------------------------------

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/auth_controller.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _obscurePassword = true;

  late AnimationController _animCtrl;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 600));
    _fadeAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut));
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = context.read<AuthController>();
    final ok = await auth.login(
      email: _emailCtrl.text.trim(),
      password: _passwordCtrl.text,
    );
    if (!mounted) return;
    if (ok) {
      // Pop back to HomeScreen — user is now logged in
      Navigator.of(context).popUntil((r) => r.isFirst);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
              'Welcome back, ${auth.currentUser?.username ?? 'Traveler'}! ✈️'),
          backgroundColor: const Color(0xFF6EE7F7).withOpacity(0.9),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(auth.errorMessage),
          backgroundColor: Colors.redAccent.withOpacity(0.9),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A1628),
      body: SafeArea(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: SlideTransition(
            position: _slideAnim,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 32),

                  // ── Back Button ──────────────────────────────
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.arrow_back_ios_new_rounded,
                          color: Colors.white70, size: 18),
                    ),
                  ),

                  const SizedBox(height: 36),

                  // ── Logo area ────────────────────────────────
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF6EE7F7), Color(0xFFA78BFA)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: const Icon(Icons.travel_explore_rounded,
                        color: Color(0xFF0A1628), size: 32),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Welcome Back',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Sign in to continue your adventures.',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.45),
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 44),

                  // ── Form ─────────────────────────────────────
                  Expanded(
                    child: Form(
                      key: _formKey,
                      child: Column(
                        children: [
                          // Email
                          TextFormField(
                            controller: _emailCtrl,
                            keyboardType: TextInputType.emailAddress,
                            style: const TextStyle(color: Colors.white),
                            validator: (v) {
                              if (v == null || v.isEmpty) {
                                return 'Email is required';
                              }
                              if (!v.contains('@')) return 'Enter a valid email';
                              return null;
                            },
                            decoration: _inputDecoration(
                              'Email Address',
                              Icons.email_rounded,
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Password
                          TextFormField(
                            controller: _passwordCtrl,
                            obscureText: _obscurePassword,
                            style: const TextStyle(color: Colors.white),
                            validator: (v) => (v == null || v.isEmpty)
                                ? 'Password is required'
                                : null,
                            decoration:
                                _inputDecoration('Password', Icons.lock_rounded)
                                    .copyWith(
                              suffixIcon: GestureDetector(
                                onTap: () => setState(() =>
                                    _obscurePassword = !_obscurePassword),
                                child: Icon(
                                  _obscurePassword
                                      ? Icons.visibility_off_rounded
                                      : Icons.visibility_rounded,
                                  color: Colors.white38,
                                  size: 20,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 32),

                          // ── Sign In Button ───────────────────
                          Consumer<AuthController>(
                            builder: (_, auth, __) => SizedBox(
                              width: double.infinity,
                              height: 54,
                              child: ElevatedButton(
                                onPressed: auth.isLoading ? null : _submit,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF6EE7F7),
                                  foregroundColor: const Color(0xFF0A1628),
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16)),
                                  elevation: 0,
                                ),
                                child: auth.isLoading
                                    ? const SizedBox(
                                        width: 22,
                                        height: 22,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2.5,
                                          color: Color(0xFF0A1628),
                                        ),
                                      )
                                    : const Text(
                                        'Sign In',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 24),

                          // ── Divider ──────────────────────────
                          Row(
                            children: [
                              Expanded(
                                  child: Divider(
                                      color: Colors.white.withOpacity(0.1))),
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 16),
                                child: Text(
                                  'or',
                                  style: TextStyle(
                                      color: Colors.white.withOpacity(0.3),
                                      fontSize: 13),
                                ),
                              ),
                              Expanded(
                                  child: Divider(
                                      color: Colors.white.withOpacity(0.1))),
                            ],
                          ),

                          const SizedBox(height: 24),

                          // ── Register Button ──────────────────
                          SizedBox(
                            width: double.infinity,
                            height: 54,
                            child: OutlinedButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (_) => const RegisterScreen()),
                                );
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: const Color(0xFF6EE7F7),
                                side: const BorderSide(
                                    color: Color(0xFF6EE7F7), width: 1.5),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16)),
                              ),
                              child: const Text(
                                'Create New Account',
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, size: 20, color: Colors.white38),
      labelStyle:
          TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 14),
      filled: true,
      fillColor: Colors.white.withOpacity(0.05),
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
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
      ),
      errorStyle: const TextStyle(color: Colors.redAccent, fontSize: 12),
    );
  }
}
