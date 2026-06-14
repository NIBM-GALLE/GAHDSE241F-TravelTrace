package com.tracktale.tracktale.repository;

import com.tracktale.tracktale.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    /**
     * Fetch all trips belonging to a specific user.
     *
     * @param userId the primary key of the owning User
     * @return list of Trip entities for that user
     */
    List<Trip> findByUserId(Long userId);
}
