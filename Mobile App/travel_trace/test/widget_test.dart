// test/widget_test.dart
// -----------------------------------------------------------
// Basic smoke test for TravelTraceApp.
// Verifies the app boots without throwing and renders the
// HomeScreen title text.
// -----------------------------------------------------------

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:travel_trace/controllers/trip_controller.dart';
import 'package:travel_trace/main.dart';

void main() {
  testWidgets('TravelTraceApp boots and shows home screen',
      (WidgetTester tester) async {
    // Build the full app with Provider
    await tester.pumpWidget(const TravelTraceApp());

    // Allow async initState (loadUserTrips) to settle
    await tester.pump();

    // The app title should be visible in the SliverAppBar
    expect(find.text('TravelTrace'), findsWidgets);
  });

  testWidgets('TripController is available via Provider',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => TripController(),
        child: const MaterialApp(
          home: Scaffold(
            body: Text('Provider OK'),
          ),
        ),
      ),
    );

    expect(find.text('Provider OK'), findsOneWidget);
  });
}
