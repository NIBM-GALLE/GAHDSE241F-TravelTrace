package com.tracktale.tracktale.controller;

import com.tracktale.tracktale.dto.CreateUserRequest;
import com.tracktale.tracktale.model.User;
import com.tracktale.tracktale.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * REST controller for User management under /api/users.
 * Provides endpoints to look up and create users so the Flutter app
 * can register accounts and seed a demo user.
 */
@RestController
@RequestMapping("/api/users")
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
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------------------------
    // POST /api/users
    // Register / create a new user
    // Body: { "username": "demo", "email": "demo@example.com", "password": "pass" }
    // Returns 409 Conflict if username or email already taken.
    // -------------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // NOTE: In production, hash the password with BCrypt before saving.
        user.setPassword(request.getPassword());

        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // -------------------------------------------------------------------------
    // GET /api/users/by-username/{username}
    // Lookup a user by username (useful for login / demo seeding checks)
    // -------------------------------------------------------------------------
    @GetMapping("/by-username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
