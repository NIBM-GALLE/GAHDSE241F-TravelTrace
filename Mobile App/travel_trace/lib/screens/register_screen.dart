// lib/screens/register_screen.dart
// -----------------------------------------------------------
// Full-screen user registration form.
// Fields: Full Name, Email, Password, Phone Number, Address.
// On success, calls AuthController.register() which auto-logs
// the user in and returns to HomeScreen.
// -----------------------------------------------------------

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/auth_controller.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();

  bool _obscurePassword = true;
  late AnimationController _animCtrl;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 700));
    _fadeAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _phoneCtrl.dispose();
    _addressCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = context.read<AuthController>();
    final ok = await auth.register(
      username: _nameCtrl.text.trim(),
      email: _emailCtrl.text.trim(),
      password: _passwordCtrl.text,
      phoneNumber: _phoneCtrl.text.trim(),
      address: _addressCtrl.text.trim(),
    );
    if (!mounted) return;
    if (ok) {
      // Pop back to HomeScreen — user is now logged in
      Navigator.of(context).popUntil((r) => r.isFirst);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
              'Welcome, ${auth.currentUser?.username ?? 'Traveler'}! 🎉'),
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
          child: CustomScrollView(
            slivers: [
              // ── Header ──────────────────────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 32, 24, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Back button
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
                      const SizedBox(height: 32),
                      // Globe icon
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
                        'Create Account',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 30,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Join TravelTrace and start your journey.',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.45),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 36),
                    ],
                  ),
                ),
              ),

              // ── Form ────────────────────────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        _buildField(
                          controller: _nameCtrl,
                          label: 'Full Name',
                          icon: Icons.person_rounded,
                          validator: (v) =>
                              (v == null || v.isEmpty) ? 'Name is required' : null,
                        ),
                        const SizedBox(height: 16),
                        _buildField(
                          controller: _emailCtrl,
                          label: 'Email Address',
                          icon: Icons.email_rounded,
                          keyboardType: TextInputType.emailAddress,
                          validator: (v) {
                            if (v == null || v.isEmpty) return 'Email is required';
                            if (!v.contains('@')) return 'Enter a valid email';
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        // Password field with toggle
                        TextFormField(
                          controller: _passwordCtrl,
                          obscureText: _obscurePassword,
                          style: const TextStyle(color: Colors.white),
                          validator: (v) {
                            if (v == null || v.isEmpty) return 'Password is required';
                            if (v.length < 6) return 'Min 6 characters';
                            return null;
                          },
                          decoration: _inputDecoration(
                            'Password',
                            Icons.lock_rounded,
                          ).copyWith(
                            suffixIcon: GestureDetector(
                              onTap: () => setState(
                                  () => _obscurePassword = !_obscurePassword),
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
                        const SizedBox(height: 16),
                        _buildField(
                          controller: _phoneCtrl,
                          label: 'Phone Number',
                          icon: Icons.phone_rounded,
                          keyboardType: TextInputType.phone,
                          validator: (v) =>
                              (v == null || v.isEmpty) ? 'Phone is required' : null,
                        ),
                        const SizedBox(height: 16),
                        _buildField(
                          controller: _addressCtrl,
                          label: 'Address',
                          icon: Icons.location_on_rounded,
                          maxLines: 2,
                          validator: (v) =>
                              (v == null || v.isEmpty) ? 'Address is required' : null,
                        ),
                        const SizedBox(height: 32),

                        // ── Submit Button ──────────────────────
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
                                      'Create Account',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 24),

                        // ── Login Link ─────────────────────────
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Already have an account? ',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.45),
                                fontSize: 14,
                              ),
                            ),
                            GestureDetector(
                              onTap: () => Navigator.pop(context),
                              child: const Text(
                                'Sign In',
                                style: TextStyle(
                                  color: Color(0xFF6EE7F7),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 40),
                      ],
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

  // ── Helpers ─────────────────────────────────────────────────

  Widget _buildField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      style: const TextStyle(color: Colors.white),
      validator: validator,
      decoration: _inputDecoration(label, icon),
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
