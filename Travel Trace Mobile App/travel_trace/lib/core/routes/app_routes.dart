import 'package:flutter/material.dart';
import 'package:travel_trace/features/auth/presentation/pages/login_page.dart';
import 'package:travel_trace/features/auth/presentation/pages/signup_page.dart';
import 'package:travel_trace/features/home/presentation/pages/home_page.dart';

class AppRoutes {
  static const String login = '/login';
  static const String signup = '/signup';
  static const String home = '/home';

  static Map<String, WidgetBuilder> get routes => {
        login: (_) => const LoginPage(),
        signup: (_) => const SignupPage(),
        home: (_) => const HomePage(),
      };
}
