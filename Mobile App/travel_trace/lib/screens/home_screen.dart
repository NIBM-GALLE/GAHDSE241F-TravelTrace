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
  int _currentIndex = 0;
  String _selectedStatusFilter = 'ALL';
  late AuthController _authController;

  @override
  void initState() {
    super.initState();
    _authController = context.read<AuthController>();
    _authController.addListener(_onAuthChanged);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_authController.isLoggedIn) {
        context
            .read<TripController>()
            .loadUserTrips(_authController.currentUser!.id);
      }
    });
  }

  @override
  void dispose() {
    _authController.removeListener(_onAuthChanged);
    super.dispose();
  }

  void _onAuthChanged() {
    if (!mounted) return;
    if (_authController.isLoggedIn) {
      context
          .read<TripController>()
          .loadUserTrips(_authController.currentUser!.id);
    } else {
      context.read<TripController>().clearTrips();
    }
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

  // ── Create Trip Bottom Sheet ───────────────────────────────
  Future<void> _showCreateTripDialog(String userId) async {
    final titleController = TextEditingController();
    final descController = TextEditingController();
    final formKey = GlobalKey<FormState>();

    String? selectedProvince;
    String? selectedDuration;
    final Set<String> selectedTags = {};

    const provinces = [
      'Western Province',
      'Central Province',
      'Southern Province',
      'Northern Province',
      'Eastern Province',
      'North Western Province',
      'North Central Province',
      'Uva Province',
      'Sabaragamuwa Province',
    ];

    const durations = [
      'Half day',
      '1 day',
      '2 days',
      '3 days',
      '4–5 days',
      '1 week',
      '1+ week',
    ];

    const allTags = [
      'Hiking',
      'Scenic',
      'Culture',
      'Heritage',
      'Coastal',
      'Wildlife',
      'City',
      'Adventure',
      'Photography',
      'National Park',
      'Trekking',
      'Tea Country',
      'Ocean',
    ];

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => DraggableScrollableSheet(
          initialChildSize: 0.92,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          builder: (_, scrollController) => Container(
            decoration: const BoxDecoration(
              color: Color(0xFF0F1E2E),
              borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            ),
            child: Column(
              children: [
                // ── Handle bar ──────────────────────────────
                Container(
                  margin: const EdgeInsets.only(top: 12, bottom: 4),
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                // ── Header ──────────────────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 4),
                  child: Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF6EE7F7), Color(0xFFA78BFA)],
                          ),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.add_location_alt_rounded,
                            color: Colors.white, size: 20),
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'Create New Trip',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const Spacer(),
                      GestureDetector(
                        onTap: () => Navigator.pop(ctx),
                        child: const Icon(Icons.close_rounded,
                            color: Colors.white38, size: 22),
                      ),
                    ],
                  ),
                ),
                const Divider(color: Colors.white10, height: 20),
                // ── Scrollable Form ──────────────────────────
                Expanded(
                  child: SingleChildScrollView(
                    controller: scrollController,
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                    child: Form(
                      key: formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Title
                          _sectionLabel('Trip Title *'),
                          TextFormField(
                            controller: titleController,
                            style: const TextStyle(color: Colors.white),
                            validator: (v) =>
                                v == null || v.trim().isEmpty ? 'Title is required' : null,
                            decoration: _inputDecoration(
                                'e.g. Ella Sunrise Hike', Icons.map_rounded),
                          ),
                          const SizedBox(height: 18),

                          // Description
                          _sectionLabel('Description'),
                          TextFormField(
                            controller: descController,
                            style: const TextStyle(color: Colors.white),
                            maxLines: 3,
                            decoration: _inputDecoration(
                                'Tell us about this trip...', Icons.notes_rounded),
                          ),
                          const SizedBox(height: 18),

                          // Province
                          _sectionLabel('Province'),
                          DropdownButtonFormField<String>(
                            value: selectedProvince,
                            dropdownColor: const Color(0xFF1E2A3A),
                            style: const TextStyle(color: Colors.white),
                            icon: const Icon(Icons.keyboard_arrow_down_rounded,
                                color: Colors.white38),
                            decoration: _inputDecoration(
                                'Select province', Icons.location_on_rounded),
                            items: provinces
                                .map((p) => DropdownMenuItem(
                                      value: p,
                                      child: Text(p,
                                          style: const TextStyle(
                                              color: Colors.white, fontSize: 14)),
                                    ))
                                .toList(),
                            onChanged: (val) =>
                                setModalState(() => selectedProvince = val),
                          ),
                          const SizedBox(height: 18),

                          // Duration
                          _sectionLabel('Estimated Duration'),
                          DropdownButtonFormField<String>(
                            value: selectedDuration,
                            dropdownColor: const Color(0xFF1E2A3A),
                            style: const TextStyle(color: Colors.white),
                            icon: const Icon(Icons.keyboard_arrow_down_rounded,
                                color: Colors.white38),
                            decoration: _inputDecoration(
                                'How long?', Icons.schedule_rounded),
                            items: durations
                                .map((d) => DropdownMenuItem(
                                      value: d,
                                      child: Text(d,
                                          style: const TextStyle(
                                              color: Colors.white, fontSize: 14)),
                                    ))
                                .toList(),
                            onChanged: (val) =>
                                setModalState(() => selectedDuration = val),
                          ),
                          const SizedBox(height: 20),

                          // Tags
                          _sectionLabel('Trail Categories'),
                          const SizedBox(height: 4),
                          Text(
                            'Select all that apply',
                            style: TextStyle(
                                color: Colors.white.withOpacity(0.35),
                                fontSize: 11),
                          ),
                          const SizedBox(height: 10),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: allTags.map((tag) {
                              final isSelected = selectedTags.contains(tag);
                              return GestureDetector(
                                onTap: () => setModalState(() {
                                  if (isSelected) {
                                    selectedTags.remove(tag);
                                  } else {
                                    selectedTags.add(tag);
                                  }
                                }),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 150),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 14, vertical: 7),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? const Color(0xFF6EE7F7).withOpacity(0.15)
                                        : Colors.white.withOpacity(0.05),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: isSelected
                                          ? const Color(0xFF6EE7F7)
                                          : Colors.white.withOpacity(0.1),
                                    ),
                                  ),
                                  child: Text(
                                    tag,
                                    style: TextStyle(
                                      color: isSelected
                                          ? const Color(0xFF6EE7F7)
                                          : Colors.white60,
                                      fontSize: 12,
                                      fontWeight: isSelected
                                          ? FontWeight.w700
                                          : FontWeight.w500,
                                    ),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                          const SizedBox(height: 28),

                          // Create button
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () async {
                                if (!formKey.currentState!.validate()) return;
                                Navigator.pop(ctx);
                                await context.read<TripController>().createTrip(
                                      userId: userId,
                                      title: titleController.text.trim(),
                                      description: descController.text.trim(),
                                      province: selectedProvince ?? '',
                                      duration: selectedDuration ?? '',
                                      tags: selectedTags.toList(),
                                    );
                              },
                              style: ElevatedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 15),
                                backgroundColor: Colors.transparent,
                                shadowColor: Colors.transparent,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14)),
                              ).copyWith(
                                backgroundColor: WidgetStateProperty.all(
                                    Colors.transparent),
                                overlayColor: WidgetStateProperty.all(
                                    Colors.white.withOpacity(0.08)),
                              ),
                              child: Ink(
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF6EE7F7), Color(0xFFA78BFA)],
                                  ),
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Container(
                                  alignment: Alignment.center,
                                  padding: const EdgeInsets.symmetric(vertical: 15),
                                  child: const Text(
                                    'Create Trip',
                                    style: TextStyle(
                                      color: Color(0xFF0A1628),
                                      fontWeight: FontWeight.w800,
                                      fontSize: 15,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _sectionLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white70,
          fontSize: 13,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.3,
        ),
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

  // ── Filter Selector Widget ─────────────────────────────────
  Widget _buildFilterSelector() {
    final filters = ['ALL', 'ONGOING', 'COMPLETED', 'PLANNED'];
    return SliverToBoxAdapter(
      child: Container(
        height: 46,
        margin: const EdgeInsets.only(top: 16, bottom: 8),
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: filters.length,
          itemBuilder: (context, index) {
            final filter = filters[index];
            final isSelected = _selectedStatusFilter == filter;

            String label = filter;
            if (filter == 'ALL') label = 'All Trails';
            if (filter == 'ONGOING') label = 'Ongoing';
            if (filter == 'COMPLETED') label = 'Completed';
            if (filter == 'PLANNED') label = 'Planned';

            return GestureDetector(
              onTap: () {
                setState(() {
                  _selectedStatusFilter = filter;
                });
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(right: 10),
                padding: const EdgeInsets.symmetric(horizontal: 20),
                decoration: BoxDecoration(
                  gradient: isSelected
                      ? const LinearGradient(
                          colors: [Color(0xFF6EE7F7), Color(0xFFA78BFA)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        )
                      : null,
                  color: isSelected ? null : const Color(0xFF1E2A3A),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected
                        ? Colors.transparent
                        : Colors.white.withOpacity(0.05),
                  ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: const Color(0xFF6EE7F7).withOpacity(0.25),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          )
                        ]
                      : null,
                ),
                child: Center(
                  child: Text(
                    label,
                    style: TextStyle(
                      color: isSelected ? const Color(0xFF0A1628) : Colors.white70,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // ── Home View Content ──────────────────────────────────────
  Widget _buildHomeContent() {
    return CustomScrollView(
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
                Consumer2<AuthController, TripController>(
                  builder: (_, auth, ctrl, __) => Text(
                    auth.isLoggedIn
                        ? '${ctrl.trips.length} trail${ctrl.trips.length == 1 ? '' : 's'} · ${auth.currentUser!.username}'
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

        // ── Filter Selector (Only if logged in) ──────────────
        if (context.watch<AuthController>().isLoggedIn)
          _buildFilterSelector(),

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

            // Filter trips by status
            final filteredTrips = controller.trips.where((trip) {
              if (_selectedStatusFilter == 'ALL') return true;
              return trip.status.toUpperCase() == _selectedStatusFilter;
            }).toList();

            if (filteredTrips.isEmpty) {
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
                      Text(
                        'No ${_selectedStatusFilter.toLowerCase()} trails',
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Tap + New Trip to create one!',
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
                  final trip = filteredTrips[index];
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
                childCount: filteredTrips.length,
              ),
            );
          },
        ),

        // Bottom padding
        const SliverToBoxAdapter(child: SizedBox(height: 40)),
      ],
    );
  }

  // ── User Account View Content ──────────────────────────────
  Widget _buildAccountContent() {
    final auth = context.watch<AuthController>();
    final tripController = context.watch<TripController>();

    final totalTrips = tripController.trips.length;
    final ongoingTrips = tripController.trips
        .where((t) => t.status.toUpperCase() == 'ONGOING')
        .length;
    final completedTrips = tripController.trips
        .where((t) => t.status.toUpperCase() == 'COMPLETED')
        .length;
    final plannedTrips = tripController.trips
        .where((t) => t.status.toUpperCase() == 'PLANNED')
        .length;

    return CustomScrollView(
      slivers: [
        // SliverAppBar
        SliverAppBar(
          expandedHeight: 120,
          floating: false,
          pinned: true,
          backgroundColor: const Color(0xFF0A1628),
          flexibleSpace: FlexibleSpaceBar(
            titlePadding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
            title: const Text(
              'User Account',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
              ),
            ),
            background: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF0A1628), Color(0xFF131D38)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),
          ),
        ),

        // Profile Body
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: auth.isLoggedIn
                ? Column(
                    children: [
                      // Avatar Card
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF1E2A3A), Color(0xFF131D31)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: const Color(0xFF6EE7F7).withOpacity(0.15),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF6EE7F7).withOpacity(0.03),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            // Beautiful Initials Circle
                            Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFF6EE7F7), Color(0xFFA78BFA)],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF6EE7F7).withOpacity(0.3),
                                    blurRadius: 15,
                                    offset: const Offset(0, 5),
                                  ),
                                ],
                              ),
                              child: Center(
                                child: Text(
                                  auth.currentUser!.username.substring(0, 2).toUpperCase(),
                                  style: const TextStyle(
                                    color: Color(0xFF0A1628),
                                    fontSize: 28,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              auth.currentUser!.username,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              auth.currentUser!.email,
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.5),
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Stats Section
                      Row(
                        children: [
                          Expanded(
                            child: _buildStatItem('Ongoing', ongoingTrips, const Color(0xFF34D399)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildStatItem('Completed', completedTrips, const Color(0xFF6EE7F7)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildStatItem('Planned', plannedTrips, const Color(0xFFA78BFA)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // User Details Card
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E2A3A),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.05),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Account Information',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 16),
                            _buildInfoRow(Icons.phone_iphone_rounded, 'Phone Number', auth.currentUser!.phoneNumber),
                            const Divider(color: Colors.white10, height: 24),
                            _buildInfoRow(Icons.location_on_rounded, 'Address', auth.currentUser!.address),
                            const Divider(color: Colors.white10, height: 24),
                            _buildInfoRow(Icons.map_rounded, 'Total Trails', '$totalTrips saved'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Sign Out Button
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            auth.logout();
                            context.read<TripController>().clearTrips();
                          },
                          icon: const Icon(Icons.logout_rounded, size: 20),
                          label: const Text('Sign Out'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFEF4444).withOpacity(0.15),
                            foregroundColor: const Color(0xFFFCA5A5),
                            side: BorderSide(
                              color: const Color(0xFFEF4444).withOpacity(0.4),
                              width: 1.5,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            elevation: 0,
                          ),
                        ),
                      ),
                      const SizedBox(height: 40),
                    ],
                  )
                : Container(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const SizedBox(height: 40),
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: const Color(0xFF6EE7F7).withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.lock_rounded,
                            color: Color(0xFF6EE7F7),
                            size: 36,
                          ),
                        ),
                        const SizedBox(height: 24),
                        const Text(
                          'Access Your Account',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Log in or register to view your account details and manage your adventures.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.45),
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 32),
                        SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: ElevatedButton(
                            onPressed: () async {
                              await Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const LoginScreen()),
                              );
                              if (mounted) {
                                final auth = context.read<AuthController>();
                                if (auth.isLoggedIn) {
                                  context.read<TripController>().loadUserTrips(auth.currentUser!.id);
                                }
                              }
                            },
                            child: const Text('Sign In'),
                          ),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: OutlinedButton(
                            onPressed: () async {
                              await Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const RegisterScreen()),
                              );
                              if (mounted) {
                                final auth = context.read<AuthController>();
                                if (auth.isLoggedIn) {
                                  context.read<TripController>().loadUserTrips(auth.currentUser!.id);
                                }
                              }
                            },
                            style: OutlinedButton.styleFrom(
                              foregroundColor: const Color(0xFF6EE7F7),
                              side: const BorderSide(color: Color(0xFF6EE7F7), width: 1.5),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: const Text('Create Account'),
                          ),
                        ),
                      ],
                    ),
                  ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatItem(String label, int value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E2A3A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Text(
            '$value',
            style: TextStyle(
              color: color,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String title, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: const Color(0xFF6EE7F7), size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  color: Colors.white.withOpacity(0.4),
                  fontSize: 11,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value.isNotEmpty ? value : 'Not provided',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A1628),
      body: _currentIndex == 0 ? _buildHomeContent() : _buildAccountContent(),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF1E2A3A),
          border: Border(
            top: BorderSide(
              color: Colors.white.withOpacity(0.08),
              width: 1.0,
            ),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            if (index == 1) {
              _onNewTripPressed();
            } else {
              setState(() {
                _currentIndex = index;
              });
            }
          },
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFF6EE7F7),
          unselectedItemColor: Colors.white38,
          selectedFontSize: 12,
          unselectedFontSize: 12,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_rounded),
              activeIcon: Icon(Icons.home_rounded, color: Color(0xFF6EE7F7)),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.add_circle_outline_rounded),
              activeIcon: Icon(Icons.add_circle_outline_rounded, color: Color(0xFF6EE7F7)),
              label: 'New Trip',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_rounded),
              activeIcon: Icon(Icons.person_rounded, color: Color(0xFF6EE7F7)),
              label: 'Account',
            ),
          ],
        ),
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
