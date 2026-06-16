package com.tracktale.tracktale.controller;

import com.tracktale.tracktale.dto.CreateUserRequest;
import com.tracktale.tracktale.dto.LoginRequest;
import com.tracktale.tracktale.model.User;
import com.tracktale.tracktale.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * REST controller for User management under /api/users and /api/auth.
 * Provides endpoints to register, login, and look up users.
 */
@RestController
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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
    // POST /api/auth/login
    // Authenticate a user by email + password.
    // Returns 200 + User JSON on success, 401 on bad credentials, 404 if not found.
    // -------------------------------------------------------------------------
    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> optUser = userRepository.findByEmail(request.getEmail());
        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No account found with email: " + request.getEmail());
        }
        User user = optUser.get();
        // Plain-text comparison — replace with BCrypt in production
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect password.");
        }
        return ResponseEntity.ok(user);
    }
}
