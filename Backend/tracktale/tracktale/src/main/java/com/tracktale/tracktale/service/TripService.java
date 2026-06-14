package com.tracktale.tracktale.service;

import com.tracktale.tracktale.dto.CreateTripRequest;
import com.tracktale.tracktale.model.Trip;
import com.tracktale.tracktale.model.TripStatus;

import java.util.List;

/**
 * Service interface defining the core business operations for Trip management.
 */
public interface TripService {

    /**
     * Create a new trip and associate it with the given user.
     *
     * @param request DTO containing trip details and the owner's userId
     * @return the persisted Trip entity
     */
    Trip createTrip(CreateTripRequest request);

    /**
     * Retrieve all trips belonging to a specific user.
     *
     * @param userId the primary key of the User
     * @return list of Trip entities owned by that user
     */
    List<Trip> getTripsByUser(Long userId);

    /**
     * Find a single trip by its primary key.
     *
     * @param tripId the primary key of the Trip
     * @return the Trip entity
     */
    Trip getTripById(Long tripId);

    /**
     * Delete a trip by its primary key.
     *
     * @param tripId the primary key of the Trip
     */
    void deleteTrip(Long tripId);

    /**
     * Replace the routeData field on the given trip with new serialized JSON coordinates.
     *
     * @param tripId    the primary key of the Trip
     * @param routeData JSON string of route coordinate array e.g. "[[lng,lat],[lng,lat]]"
     * @return the updated Trip entity
     */
    Trip updateRouteData(Long tripId, String routeData);

    /**
     * Append a single GPS [lng, lat] coordinate pair to the trip's existing routeData JSON array.
     * Used for live tracking — called on every position update from the Flutter app.
     *
     * @param tripId    the primary key of the Trip
     * @param longitude GPS longitude
     * @param latitude  GPS latitude
     * @return the updated Trip entity
     */
    Trip appendCoordinate(Long tripId, double longitude, double latitude);

    /**
     * Append a new waypoint JSON object into the trip's waypointsData JSON array.
     *
     * @param tripId       the primary key of the Trip
     * @param waypointJson a single waypoint JSON object string
     * @return the updated Trip entity
     */
    Trip addWaypoint(Long tripId, String waypointJson);

    /**
     * Update the status of a trip (e.g. PLANNED → ONGOING → COMPLETED).
     *
     * @param tripId the primary key of the Trip
     * @param status the new TripStatus
     * @return the updated Trip entity
     */
    Trip updateStatus(Long tripId, TripStatus status);
}
