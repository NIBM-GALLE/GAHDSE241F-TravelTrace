package com.tracktale.tracktale.controller;

import com.tracktale.tracktale.dto.AddWaypointRequest;
import com.tracktale.tracktale.dto.CreateTripRequest;
import com.tracktale.tracktale.dto.StatusRequest;
import com.tracktale.tracktale.dto.TrackRequest;
import com.tracktale.tracktale.dto.UpdateRouteRequest;
import com.tracktale.tracktale.model.Trip;
import com.tracktale.tracktale.model.TripStatus;
import com.tracktale.tracktale.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing Trip management endpoints under /api/trips.
 * All endpoints return plain entity JSON — no wrapper object — so the
 * Flutter app can parse responses directly.
 */
@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")   // Allow requests from Flutter app / web front-end
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    // -------------------------------------------------------------------------
    // POST /api/trips
    // Create a new trip for a user
    // Body: { "title": "...", "description": "...", "status": "PLANNED", "userId": 1 }
    // -------------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody CreateTripRequest request) {
        Trip created = tripService.createTrip(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // -------------------------------------------------------------------------
    // GET /api/trips/user/{userId}
    // Retrieve all trips for a specific user (returns plain JSON array)
    // -------------------------------------------------------------------------
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Trip>> getTripsByUser(@PathVariable Long userId) {
        List<Trip> trips = tripService.getTripsByUser(userId);
        return ResponseEntity.ok(trips);
    }

    // -------------------------------------------------------------------------
    // GET /api/trips/all
    // Retrieve ALL trips from ALL users — used by the public web Explore page
    // -------------------------------------------------------------------------
    @GetMapping("/all")
    public ResponseEntity<List<Trip>> getAllTrips() {
        List<Trip> trips = tripService.getAllTrips();
        return ResponseEntity.ok(trips);
    }

    // -------------------------------------------------------------------------
    // GET /api/trips/{id}
    // Retrieve a single trip by ID
    // -------------------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        Trip trip = tripService.getTripById(id);
        return ResponseEntity.ok(trip);
    }

    // -------------------------------------------------------------------------
    // DELETE /api/trips/{id}
    // Delete a trip (Flutter calls this from deleteTrip())
    // -------------------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }

    // -------------------------------------------------------------------------
    // PUT /api/trips/{id}/route
    // Replace the full route coordinate JSON array on a trip
    // Body: { "routeData": "[[lng,lat],[lng,lat]]" }
    // -------------------------------------------------------------------------
    @PutMapping("/{id}/route")
    public ResponseEntity<Trip> updateRoute(
            @PathVariable Long id,
            @RequestBody UpdateRouteRequest request) {
        Trip updated = tripService.updateRouteData(id, request.getRouteData());
        return ResponseEntity.ok(updated);
    }

    // -------------------------------------------------------------------------
    // PUT /api/trips/{id}/track
    // Append a single GPS coordinate to the route (called during live tracking)
    // Body: { "latitude": 1.3521, "longitude": 103.8198 }
    // -------------------------------------------------------------------------
    @PutMapping("/{id}/track")
    public ResponseEntity<Trip> trackLocation(
            @PathVariable Long id,
            @RequestBody TrackRequest request) {
        Trip updated = tripService.appendCoordinate(id, request.getLongitude(), request.getLatitude());
        return ResponseEntity.ok(updated);
    }

    // -------------------------------------------------------------------------
    // PUT /api/trips/{id}/waypoint
    // Append a new waypoint pin into the trip's waypointsData JSON array
    // Body: { "waypointJson": "{\"lat\":1.35,\"lng\":103.82,\"note\":\"Hotel\"}" }
    // -------------------------------------------------------------------------
    @PutMapping("/{id}/waypoint")
    public ResponseEntity<Trip> addWaypoint(
            @PathVariable Long id,
            @RequestBody AddWaypointRequest request) {
        Trip updated = tripService.addWaypoint(id, request.getWaypointJson());
        return ResponseEntity.ok(updated);
    }

    // -------------------------------------------------------------------------
    // PATCH /api/trips/{id}/status
    // Update the trip status (PLANNED | ONGOING | COMPLETED)
    // Body: { "status": "COMPLETED" }
    // -------------------------------------------------------------------------
    @PatchMapping("/{id}/status")
    public ResponseEntity<Trip> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest request) {
        TripStatus newStatus;
        try {
            newStatus = TripStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        Trip updated = tripService.updateStatus(id, newStatus);
        return ResponseEntity.ok(updated);
    }
}
