package com.tracktale.tracktale.repository;

import com.tracktale.tracktale.model.Trip;
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
}
