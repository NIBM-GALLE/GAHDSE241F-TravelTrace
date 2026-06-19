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

    /** Province where the trail is located (e.g. "Uva Province"). */
    private String province;

    /** User-entered duration (e.g. "2 days", "Half day"). */
    private String duration;

    /** Comma-separated tags (e.g. "Hiking,Scenic,Culture"). */
    private String tags;
}
