package com.tracktale.tracktale.controller;

import com.tracktale.tracktale.dto.AdminReplyRequest;
import com.tracktale.tracktale.dto.CreateReviewRequest;
import com.tracktale.tracktale.model.Review;
import com.tracktale.tracktale.model.Trip;
import com.tracktale.tracktale.model.User;
import com.tracktale.tracktale.repository.ReviewRepository;
import com.tracktale.tracktale.repository.TripRepository;
import com.tracktale.tracktale.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for Review management under /api/reviews.
 * Provides endpoints to create reviews, list reviews by trail or all,
 * admin reply, and delete reviews.
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;

    public ReviewController(ReviewRepository reviewRepository,
                            UserRepository userRepository,
                            TripRepository tripRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
    }

    // -------------------------------------------------------------------------
    // POST /api/reviews
    // Create a new review for a trail
    // Body: { "tripId": 1, "userId": 2, "rating": 5, "comment": "Great trail!" }
    // -------------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody CreateReviewRequest request) {
        // Validate rating
        if (request.getRating() < 1 || request.getRating() > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5.");
        }

        if (request.getComment() == null || request.getComment().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Comment cannot be empty.");
        }

        Optional<User> optUser = userRepository.findById(request.getUserId());
        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with id: " + request.getUserId());
        }

        Optional<Trip> optTrip = tripRepository.findById(request.getTripId());
        if (optTrip.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Trip not found with id: " + request.getTripId());
        }

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());
        review.setUser(optUser.get());
        review.setTrip(optTrip.get());

        Review saved = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // -------------------------------------------------------------------------
    // GET /api/reviews/trip/{tripId}
    // Fetch all reviews for a specific trail, newest first
    // -------------------------------------------------------------------------
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<Review>> getReviewsByTrip(@PathVariable Long tripId) {
        List<Review> reviews = reviewRepository.findAllByTripIdOrderByCreatedAtDesc(tripId);
        return ResponseEntity.ok(reviews);
    }

    // -------------------------------------------------------------------------
    // GET /api/reviews/all
    // Fetch all reviews across all trails — used by admin Feedback page
    // -------------------------------------------------------------------------
    @GetMapping("/all")
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(reviews);
    }

    // -------------------------------------------------------------------------
    // PATCH /api/reviews/{id}/reply
    // Admin adds a reply to a review
    // Body: { "adminReply": "Thank you for your feedback!" }
    // -------------------------------------------------------------------------
    @PatchMapping("/{id}/reply")
    public ResponseEntity<?> replyToReview(
            @PathVariable Long id,
            @RequestBody AdminReplyRequest request) {
        Optional<Review> optReview = reviewRepository.findById(id);
        if (optReview.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (request.getAdminReply() == null || request.getAdminReply().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Reply cannot be empty.");
        }

        Review review = optReview.get();
        review.setAdminReply(request.getAdminReply().trim());
        review.setAdminRepliedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }

    // -------------------------------------------------------------------------
    // DELETE /api/reviews/{id}
    // Delete a review by ID — used by admin
    // -------------------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        if (!reviewRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reviewRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
