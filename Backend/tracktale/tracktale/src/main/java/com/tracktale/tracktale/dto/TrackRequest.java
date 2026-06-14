package com.tracktale.tracktale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for appending a GPS coordinate to a trip's route.
 * Sent by the Flutter app on every location update during live tracking.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackRequest {

    /** Latitude of the current GPS position. */
    private double latitude;

    /** Longitude of the current GPS position. */
    private double longitude;
}
