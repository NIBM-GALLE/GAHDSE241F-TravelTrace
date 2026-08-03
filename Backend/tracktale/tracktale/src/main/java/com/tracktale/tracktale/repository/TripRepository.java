package com.tracktale.tracktale.repository;

import com.tracktale.tracktale.model.Trip;
import com.tracktale.tracktale.model.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    /**
     * Fetch all trips belonging to a specific user, newest first.
     */
    List<Trip> findByUserIdOrderByIdDesc(Long userId);

    /**
     * Fetch all trips from all users — newest first (by auto-increment ID).
     * Used by the public web Explore page.
     */
    List<Trip> findAllByOrderByIdDesc();

    /** Count all trips for a user — used by admin dashboard stats. */
    long countByUserId(Long userId);

    /** Count trips by user and status — used by admin dashboard stats. */
    long countByUserIdAndStatus(Long userId, TripStatus status);

    /**
     * Fetch only published AND approved trails — for public web Explore page.
     */
    List<Trip> findAllByPublishedTrueAndApprovedTrueOrderByIdDesc();
}

