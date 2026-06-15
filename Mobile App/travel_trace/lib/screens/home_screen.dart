// lib/screens/home_screen.dart
// -----------------------------------------------------------
// Dashboard screen — shows all trips for the logged-in user.
//
// Auth gate:
//   • "New Trip" FAB checks if a user is logged in via AuthController.
//   • Not logged in → shows a bottom-sheet prompting Login or Register.
//   • Logged in → shows the create-trip dialog using the real user ID.
//
// Loads trips for the currently logged-in user once auth state is ready.
// -----------------------------------------------------------

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/auth_controller.dart';
import '../controllers/trip_controller.dart';
import '../models/trip_model.dart';
import '../widgets/trip_card.dart';
import 'login_screen.dart';
import 'map_screen.dart';
import 'register_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Trips are loaded after login — triggered by _onAuthChanged.
    // If somehow user is already set at startup, load immediately.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthController>();
      if (auth.isLoggedIn) {
        context
            .read<TripController>()
            .loadUserTrips(auth.currentUser!.id);
      }
    });
  }

  // ── Auth Gate ───────────────────────────────────────────────
  /// Called when the user taps "+ New Trip".
  /// If logged in, show create-trip dialog.
  /// If not, show the login/register bottom-sheet.
  Future<void> _onNewTripPressed() async {
    final auth = context.read<AuthController>();
    if (auth.isLoggedIn) {
      await _showCreateTripDialog(auth.currentUser!.id);
    } else {
      await _showAuthBottomSheet();
    }
  }

  /// Shows a modal bottom-sheet asking the user to log in or register.
  Future<void> _showAuthBottomSheet() async {
    await showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => _AuthBottomSheet(),
    );

    // After the bottom-sheet closes, if user is now logged in,
    // reload their trips automatically.
    if (!mounted) return;
    final auth = context.read<AuthController>();
    if (auth.isLoggedIn) {
      await context
          .read<TripController>()
          .loadUserTrips(auth.currentUser!.id);
    }
  }

  // ── Create Trip Dialog ─────────────────────────────────────
  Future<void> _showCreateTripDialog(String userId) async {
    final titleController = TextEditingController();
    final descController = TextEditingController();
    final formKey = GlobalKey<FormState>();

    await showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E2A3A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text(
          'New Trip',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
        ),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: titleController,
                style: const TextStyle(color: Colors.white),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Title required' : null,
                decoration: _inputDecoration('Trip Title', Icons.map_rounded),
              ),
              const SizedBox(height: 14),
              TextFormField(
                controller: descController,
                style: const TextStyle(color: Colors.white),
                maxLines: 2,
                decoration: _inputDecoration(
                    'Description (optional)', Icons.notes_rounded),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel',
                style: TextStyle(color: Colors.white.withOpacity(0.5))),
          ),
          ElevatedButton(
            onPressed: () async {
              if (!formKey.currentState!.validate()) return;
              Navigator.pop(ctx);
              await context.read<TripController>().createTrip(
                    userId: userId,
                    title: titleController.text.trim(),
                    description: descController.text.trim(),
                  );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6EE7F7),
              foregroundColor: const Color(0xFF0A1628),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Create',
                style: TextStyle(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, size: 18, color: Colors.white38),
      labelStyle:
          TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13),
      filled: true,
      fillColor: Colors.white.withOpacity(0.05),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.white12),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.white12),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF6EE7F7)),
      ),
    );
  }

  // ── Navigate to map for a trip ─────────────────────────────
  void _openTrip(TripModel trip) {
    context.read<TripController>().setActiveTrip(trip);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const MapScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A1628),
      body: CustomScrollView(
        slivers: [
          // ── App Bar ────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 160,
            floating: false,
            pinned: true,
            backgroundColor: const Color(0xFF0A1628),
            actions: [
              // Logout button — only visible when logged in
              Consumer<AuthController>(
                builder: (_, auth, __) => auth.isLoggedIn
                    ? IconButton(
                        tooltip: 'Logout',
                        onPressed: () {
                          auth.logout();
                          context.read<TripController>().clearTrips();
                        },
                        icon: const Icon(Icons.logout_rounded,
                            color: Colors.white54, size: 22),
                      )
                    : const SizedBox.shrink(),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
              title: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'TravelTrace',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.5,
                    ),
                  ),
                  Consumer2<AuthController, TripController>(
                    builder: (_, auth, ctrl, __) => Text(
                      auth.isLoggedIn
                          ? '${ctrl.trips.length} trip${ctrl.trips.length == 1 ? '' : 's'} · ${auth.currentUser!.username}'
                          : 'Sign in to track your trips',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.45),
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ),
                ],
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF0A1628), Color(0xFF0F2048)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Align(
                  alignment: Alignment.topRight,
                  child: Padding(
                    padding: const EdgeInsets.only(top: 60, right: 20),
                    child: Icon(
                      Icons.travel_explore_rounded,
                      size: 80,
                      color: const Color(0xFF6EE7F7).withOpacity(0.08),
                    ),
                  ),
                ),
              ),
            ),
          ),

          // ── Trip List ──────────────────────────────────────
          Consumer<TripController>(
            builder: (context, controller, _) {
              if (controller.isLoading) {
                return const SliverFillRemaining(
                  child: Center(
                    child: CircularProgressIndicator(
                      color: Color(0xFF6EE7F7),
                    ),
                  ),
                );
              }

              if (controller.loadingState == LoadingState.error) {
                return SliverFillRemaining(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.cloud_off_rounded,
                              color: Colors.white24, size: 60),
                          const SizedBox(height: 16),
                          Text(
                            controller.errorMessage,
                            style: TextStyle(
                                color: Colors.white.withOpacity(0.5),
                                fontSize: 14),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 20),
                          ElevatedButton.icon(
                            onPressed: () {
                              final auth = context.read<AuthController>();
                              if (auth.isLoggedIn) {
                                controller.loadUserTrips(
                                    auth.currentUser!.id);
                              }
                            },
                            icon: const Icon(Icons.refresh_rounded, size: 18),
                            label: const Text('Retry'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF6EE7F7),
                              foregroundColor: const Color(0xFF0A1628),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }

              // ── Not logged in — prompt ─────────────────────
              if (!context.watch<AuthController>().isLoggedIn) {
                return SliverFillRemaining(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.lock_outline_rounded,
                            size: 64,
                            color: const Color(0xFF6EE7F7).withOpacity(0.25),
                          ),
                          const SizedBox(height: 20),
                          const Text(
                            'Sign in to see your trips',
                            style: TextStyle(
                              color: Colors.white54,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Tap + New Trip to get started',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.3),
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }

              if (controller.trips.isEmpty) {
                return SliverFillRemaining(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.map_outlined,
                          size: 72,
                          color: const Color(0xFF6EE7F7).withOpacity(0.2),
                        ),
                        const SizedBox(height: 20),
                        const Text(
                          'No trips yet',
                          style: TextStyle(
                            color: Colors.white54,
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Tap + to start your first adventure',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.35),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }

              return SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final trip = controller.trips[index];
                    return TripCard(
                      trip: trip,
                      onTap: () => _openTrip(trip),
                      onDelete: () async {
                        final confirmed = await showDialog<bool>(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            backgroundColor: const Color(0xFF1E2A3A),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16)),
                            title: const Text('Delete Trip',
                                style: TextStyle(color: Colors.white)),
                            content: Text(
                              'Delete "${trip.title}"? This cannot be undone.',
                              style: TextStyle(
                                  color: Colors.white.withOpacity(0.6)),
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(ctx, false),
                                child: const Text('Cancel',
                                    style: TextStyle(color: Colors.white54)),
                              ),
                              ElevatedButton(
                                onPressed: () => Navigator.pop(ctx, true),
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.redAccent),
                                child: const Text('Delete'),
                              ),
                            ],
                          ),
                        );
                        if (confirmed == true && context.mounted) {
                          controller.deleteTrip(trip.id);
                        }
                      },
                    );
                  },
                  childCount: controller.trips.length,
                ),
              );
            },
          ),

          // Bottom padding for FAB
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),

      // ── FAB ────────────────────────────────────────────────
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _onNewTripPressed,
        backgroundColor: const Color(0xFF6EE7F7),
        foregroundColor: const Color(0xFF0A1628),
        icon: const Icon(Icons.add_rounded),
        label: const Text('New Trip',
            style: TextStyle(fontWeight: FontWeight.w700)),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// _AuthBottomSheet
// Bottom-sheet shown when unauthenticated user taps "New Trip".
// Prompts them to login or register.
// ─────────────────────────────────────────────────────────────
class _AuthBottomSheet extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF1E2A3A),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 40),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 28),

          // Icon
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: const Color(0xFF6EE7F7).withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.travel_explore_rounded,
                color: Color(0xFF6EE7F7), size: 28),
          ),
          const SizedBox(height: 18),

          const Text(
            'Sign in to Create a Trip',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'You need an account to save and track your trips.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.white.withOpacity(0.45),
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 32),

          // Login button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context); // close sheet
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6EE7F7),
                foregroundColor: const Color(0xFF0A1628),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
                elevation: 0,
              ),
              child: const Text('Sign In',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
            ),
          ),
          const SizedBox(height: 12),

          // Register button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: OutlinedButton(
              onPressed: () {
                Navigator.pop(context); // close sheet
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const RegisterScreen()),
                );
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: const Color(0xFF6EE7F7),
                side: const BorderSide(color: Color(0xFF6EE7F7), width: 1.5),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text('Create Account',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
            ),
          ),
        ],
      ),
    );
  }
}
