class User {
  final int id;
  final String username;
  final String email;
  final String? role;
  final String? profileImageUrl;
  final String? bio;

  User({
    required this.id,
    required this.username,
    required this.email,
    this.role,
    this.profileImageUrl,
    this.bio,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? json['user_id'] ?? 0,
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      role: json['role'],
      profileImageUrl: json['profile_image_url'] ?? json['profileImageUrl'],
      bio: json['bio'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'role': role,
      'profile_image_url': profileImageUrl,
      'bio': bio,
    };
  }
}
