import 'package:flutter/material.dart';
import 'create_trail_screen.dart';

class TrailsScreen extends StatelessWidget {
  const TrailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trails'),
      ),
      body: const Center(
        child: Text('Your Trails'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const CreateTrailScreen(),
            ),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
