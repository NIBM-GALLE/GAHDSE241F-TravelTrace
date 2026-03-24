import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:travel_trace/core/routes/app_routes.dart';
import 'package:travel_trace/data/services/api_service.dart';
import 'package:travel_trace/data/services/token_storage_service.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String? _username;
  String? _email;

  @override
  void initState() {
    super.initState();
    _loadUserInfo();
  }

  Future<void> _loadUserInfo() async {
    final userJson = await TokenStorageService.getUser();
    if (userJson != null) {
      try {
        final json = Map<String, dynamic>.from(
          (userJson is String) ? jsonDecode(userJson) : userJson,
        );
        setState(() {
          _username = json['username'];
          _email = json['email'];
        });
      } catch (e) {
        // Silently handle parsing error
      }
    }
  }

  Future<void> _logout() async {
    await ApiService.logout();
    if (mounted) {
      Navigator.pushReplacementNamed(context, AppRoutes.login);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel Trace'),
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Welcome!',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 12),
                    if (_username != null)
                      Text(
                        'User: $_username',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    if (_email != null)
                      Text(
                        'Email: $_email',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Features',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            Card(
              child: ListTile(
                leading: const Icon(Icons.location_on),
                title: const Text('Record Trails'),
                subtitle: const Text('Track your travel adventures'),
              ),
            ),
            const SizedBox(height: 8),
            Card(
              child: ListTile(
                leading: const Icon(Icons.map),
                title: const Text('View Map'),
                subtitle: const Text('See your recorded routes'),
              ),
            ),
            const SizedBox(height: 8),
            Card(
              child: ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Gallery'),
                subtitle: const Text('Manage your travel photos'),
              ),
            ),
            const SizedBox(height: 32),
            FilledButton.tonal(
              onPressed: _logout,
              child: const Padding(
                padding: EdgeInsets.symmetric(vertical: 12),
                child: Text('Logout'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
