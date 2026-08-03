package com.tracktale.tracktale.controller;

import com.tracktale.tracktale.dto.CreateUserRequest;
import com.tracktale.tracktale.dto.LoginRequest;
import com.tracktale.tracktale.dto.UpdateProfileImageRequest;
import com.tracktale.tracktale.dto.UserStatusRequest;
import com.tracktale.tracktale.dto.UserWithStatsResponse;
import com.tracktale.tracktale.model.TripStatus;
import com.tracktale.tracktale.model.User;
import com.tracktale.tracktale.model.UserStatus;
import com.tracktale.tracktale.repository.TripRepository;
import com.tracktale.tracktale.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for User management under /api/users and /api/auth.
 * Provides endpoints to register, login, look up, and admin-manage users.
 */
@RestController
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;

    public UserController(UserRepository userRepository, TripRepository tripRepository) {
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
    }

    // -------------------------------------------------------------------------
    // GET /api/users/{id}
    // Fetch a user by primary key
    // -------------------------------------------------------------------------
    @GetMapping("/api/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------------------------
    // GET /api/users/all
    // Fetch all users with their trip statistics — used by admin dashboard
    // -------------------------------------------------------------------------
    @GetMapping("/api/users/all")
    public ResponseEntity<List<UserWithStatsResponse>> getAllUsers() {
        List<User> users = userRepository.findAllByOrderByIdDesc();

        List<UserWithStatsResponse> response = users.stream().map(user -> {
            long total = tripRepository.countByUserId(user.getId());
            long ongoing = tripRepository.countByUserIdAndStatus(user.getId(), TripStatus.ONGOING);
            long completed = tripRepository.countByUserIdAndStatus(user.getId(), TripStatus.COMPLETED);
            long planned = tripRepository.countByUserIdAndStatus(user.getId(), TripStatus.PLANNED);

            return new UserWithStatsResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getAddress(),
                    user.getProfileImageUrl(),
                    user.getStatus(),
                    total,
                    ongoing,
                    completed,
                    planned
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // -------------------------------------------------------------------------
    // POST /api/users
    // Register / create a new user
    // Body: { "username": "John", "email": "john@example.com", "password": "pass",
    //         "phoneNumber": "0771234567", "address": "Galle, Sri Lanka" }
    // Returns 409 Conflict if email already taken.
    // -------------------------------------------------------------------------
    @PostMapping("/api/users")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // NOTE: In production, hash the password with BCrypt before saving.
        user.setPassword(request.getPassword());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setStatus(UserStatus.ACTIVE);

        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // -------------------------------------------------------------------------
    // GET /api/users/by-username/{username}
    // Lookup a user by username
    // -------------------------------------------------------------------------
    @GetMapping("/api/users/by-username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------------------------
    // DELETE /api/users/{id}
    // Delete a user and all their trips (cascade) — used by admin dashboard
    // -------------------------------------------------------------------------
    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // -------------------------------------------------------------------------
    // PATCH /api/users/{id}/status
    // Update user status (ACTIVE / SUSPENDED) — used by admin dashboard
    // Body: { "status": "SUSPENDED" }
    // -------------------------------------------------------------------------
    @PatchMapping("/api/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UserStatusRequest request) {
        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UserStatus newStatus;
        try {
            newStatus = UserStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid status. Must be ACTIVE or SUSPENDED.");
        }

        User user = optUser.get();
        user.setStatus(newStatus);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    // -------------------------------------------------------------------------
    // PATCH /api/users/{id}/profile-image
    // Update user profile image URL — called after Cloudinary upload
    // Body: { "profileImageUrl": "https://res.cloudinary.com/..." }
    // -------------------------------------------------------------------------
    @PatchMapping("/api/users/{id}/profile-image")
    public ResponseEntity<?> updateProfileImage(
            @PathVariable Long id,
            @RequestBody UpdateProfileImageRequest request) {
        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optUser.get();
        user.setProfileImageUrl(request.getProfileImageUrl());
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    // -------------------------------------------------------------------------
    // POST /api/auth/login
    // Authenticate a user by email + password.
    // Returns 200 + User JSON on success, 401 on bad credentials,
    // 403 if suspended, 404 if not found.
    // -------------------------------------------------------------------------
    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> optUser = userRepository.findByEmail(request.getEmail());
        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No account found with email: " + request.getEmail());
        }
        User user = optUser.get();

        // Check if account is suspended
        if (user.getStatus() == UserStatus.SUSPENDED) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Your account has been suspended. Please contact support.");
        }

        // Plain-text comparison — replace with BCrypt in production
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect password.");
        }
        return ResponseEntity.ok(user);
    }
}
