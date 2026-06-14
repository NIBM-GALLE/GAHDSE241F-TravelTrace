package com.tracktale.tracktale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for updating the route coordinate data on a Trip.
 * routeData should be a serialized JSON array: [[lng, lat], [lng, lat], ...]
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRouteRequest {

    /** Full JSON string of route coordinates to replace/set on the trip. */
    private String routeData;
}
