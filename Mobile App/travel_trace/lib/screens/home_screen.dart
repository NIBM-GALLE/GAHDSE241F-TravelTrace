// lib/screens/home_screen.dart
// -----------------------------------------------------------
// Dashboard screen — shows all trips for the logged-in user.
// Provides FAB to create new trips and navigation to MapScreen.
//
// For simplicity, a hardcoded demo userId is used. In a real
// app, replace with the authenticated user's ID from auth state.
// -----------------------------------------------------------

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/trip_controller.dart';
import '../models/trip_model.dart';
import '../widgets/trip_card.dart';
import 'map_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  // Demo user: user with id=1 in MySQL.
  // Seed this user first via: POST /api/users
  // { "username": "demo", "email": "demo@traveltrace.com", "password": "demo123" }
  static const String demoUserId = '1';

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Load trips once on first build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TripController>().loadUserTrips(HomeScreen.demoUserId);
    });
  }

  // ── Create Trip Dialog ─────────────────────────────────────
  Future<void> _showCreateTripDialog() async {
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
            child:
                Text('Cancel', style: TextStyle(color: Colors.white.withOpacity(0.5))),
          ),
          ElevatedButton(
            onPressed: () async {
              if (!formKey.currentState!.validate()) return;
              Navigator.pop(ctx);
              await context.read<TripController>().createTrip(
                    userId: HomeScreen.demoUserId,
                    title: titleController.text.trim(),
                    description: descController.text.trim(),
                  );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6EE7F7),
              foregroundColor: const Color(0xFF0A1628),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
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
      labelStyle: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13),
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
                  Consumer<TripController>(
                    builder: (_, ctrl, __) => Text(
                      '${ctrl.trips.length} trip${ctrl.trips.length == 1 ? '' : 's'}',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.45),
                        fontSize: 13,
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
                            onPressed: () => controller
                                .loadUserTrips(HomeScreen.demoUserId),
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
                                    style:
                                        TextStyle(color: Colors.white54)),
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
        onPressed: _showCreateTripDialog,
        backgroundColor: const Color(0xFF6EE7F7),
        foregroundColor: const Color(0xFF0A1628),
        icon: const Icon(Icons.add_rounded),
        label: const Text('New Trip',
            style: TextStyle(fontWeight: FontWeight.w700)),
      ),
    );
  }
}
