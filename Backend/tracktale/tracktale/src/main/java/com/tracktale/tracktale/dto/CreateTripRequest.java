package com.tracktale.tracktale.dto;

import com.tracktale.tracktale.model.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for creating a new Trip.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTripRequest {

    private String title;
    private String description;
    private TripStatus status;

    /** The owning user's ID. */
    private Long userId;
}
