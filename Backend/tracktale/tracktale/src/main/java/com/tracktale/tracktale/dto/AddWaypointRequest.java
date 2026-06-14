package com.tracktale.tracktale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for appending a new waypoint pin to a Trip.
 * waypointJson should be a single JSON object representing one pin:
 * { "lat": 1.35, "lng": 103.82, "note": "Hotel", "imageUrl": "https://...", "timestamp": "..." }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddWaypointRequest {

    /** A single waypoint as a JSON-formatted string object. */
    private String waypointJson;
}
