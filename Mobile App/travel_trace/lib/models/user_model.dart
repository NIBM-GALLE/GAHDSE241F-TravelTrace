// lib/models/user_model.dart
// -----------------------------------------------------------
// Dart model representing a registered/logged-in user.
// Maps from the Spring Boot User entity JSON response:
// {
//   "id": 1,
//   "username": "John Doe",
//   "email": "john@example.com",
//   "phoneNumber": "0771234567",
//   "address": "Galle, Sri Lanka"
// }
// Note: password is @JsonIgnore on the backend, never returned.
// -----------------------------------------------------------

class UserModel {
  final String id;       // Long from backend stored as String
  final String username;
  final String email;
  final String phoneNumber;
  final String address;

  const UserModel({
    required this.id,
    required this.username,
    required this.email,
    required this.phoneNumber,
    required this.address,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: (json['id'] ?? 0).toString(),
      username: json['username'] as String? ?? '',
      email: json['email'] as String? ?? '',
      phoneNumber: json['phoneNumber'] as String? ?? '',
      address: json['address'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': int.tryParse(id) ?? 0,
        'username': username,
        'email': email,
        'phoneNumber': phoneNumber,
        'address': address,
      };

  @override
  String toString() =>
      'UserModel(id: $id, username: $username, email: $email)';
}
