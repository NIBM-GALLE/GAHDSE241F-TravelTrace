package com.tracktale.tracktale.repository;

import com.tracktale.tracktale.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /** Get all reviews for a specific trail, newest first. */
    List<Review> findAllByTripIdOrderByCreatedAtDesc(Long tripId);

    /** Get all reviews across all trails, newest first — for admin. */
    List<Review> findAllByOrderByCreatedAtDesc();

    /** Count total reviews for a specific trail. */
    long countByTripId(Long tripId);
}
