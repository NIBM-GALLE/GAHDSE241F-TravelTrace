package com.tracktale.tracktale.service.impl;

import com.tracktale.tracktale.dto.CreateTripRequest;
import com.tracktale.tracktale.model.Trip;
import com.tracktale.tracktale.model.TripStatus;
import com.tracktale.tracktale.model.User;
import com.tracktale.tracktale.repository.TripRepository;
import com.tracktale.tracktale.repository.UserRepository;
import com.tracktale.tracktale.service.TripService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripServiceImpl(TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    // -------------------------------------------------------------------------
    // Create
    // -------------------------------------------------------------------------

    @Override
    public Trip createTrip(CreateTripRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + request.getUserId()));

        Trip trip = new Trip();
        trip.setTitle(request.getTitle());
        trip.setDescription(request.getDescription());
        trip.setStatus(request.getStatus() != null ? request.getStatus() : TripStatus.PLANNED);
        trip.setRouteData("[]");
        trip.setWaypointsData("[]");
        trip.setProvince(request.getProvince() != null ? request.getProvince() : "");
        trip.setDuration(request.getDuration() != null ? request.getDuration() : "");
        trip.setTags(request.getTags() != null ? request.getTags() : "");
        trip.setUser(user);

        return tripRepository.save(trip);
    }

    // -------------------------------------------------------------------------
    // Read
    // -------------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<Trip> getTripsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return tripRepository.findByUserIdOrderByIdDesc(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Trip getTripById(Long tripId) {
        return findTripOrThrow(tripId);
    }

    // -------------------------------------------------------------------------
    // Delete
    // -------------------------------------------------------------------------

    @Override
    public void deleteTrip(Long tripId) {
        Trip trip = findTripOrThrow(tripId);
        tripRepository.delete(trip);
    }

    // -------------------------------------------------------------------------
    // Update – Route Data (full replacement)
    // -------------------------------------------------------------------------

    @Override
    public Trip updateRouteData(Long tripId, String routeData) {
        Trip trip = findTripOrThrow(tripId);
        trip.setRouteData(routeData);
        return tripRepository.save(trip);
    }

    // -------------------------------------------------------------------------
    // Update – Append a single GPS coordinate (live tracking)
    // -------------------------------------------------------------------------

    @Override
    public Trip appendCoordinate(Long tripId, double longitude, double latitude) {
        Trip trip = findTripOrThrow(tripId);

        String existing = trip.getRouteData();
        // Coordinate pair as [lng, lat] to follow GeoJSON convention
        String newPair = "[" + longitude + "," + latitude + "]";

        if (existing == null || existing.isBlank() || existing.equals("[]")) {
            trip.setRouteData("[" + newPair + "]");
        } else {
            // Append before the closing bracket
            String trimmed = existing.strip();
            String updated = trimmed.substring(0, trimmed.length() - 1) + "," + newPair + "]";
            trip.setRouteData(updated);
        }

        return tripRepository.save(trip);
    }

    // -------------------------------------------------------------------------
    // Update – Waypoints (append a new waypoint into the JSON array)
    // -------------------------------------------------------------------------

    @Override
    public Trip addWaypoint(Long tripId, String waypointJson) {
        Trip trip = findTripOrThrow(tripId);

        String existing = trip.getWaypointsData();

        if (existing == null || existing.isBlank() || existing.equals("[]")) {
            trip.setWaypointsData("[" + waypointJson + "]");
        } else {
            String trimmed = existing.strip();
            String updated = trimmed.substring(0, trimmed.length() - 1)
                    + "," + waypointJson + "]";
            trip.setWaypointsData(updated);
        }

        return tripRepository.save(trip);
    }

    // -------------------------------------------------------------------------
    // Update – Status
    // -------------------------------------------------------------------------

    @Override
    public Trip updateStatus(Long tripId, TripStatus status) {
        Trip trip = findTripOrThrow(tripId);
        trip.setStatus(status);
        return tripRepository.save(trip);
    }

    // -------------------------------------------------------------------------
    // Get All Trips — public Explore page
    // -------------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<Trip> getAllTrips() {
        return tripRepository.findAllByOrderByIdDesc();
    }

    // -------------------------------------------------------------------------
    // Helper
    // -------------------------------------------------------------------------

    private Trip findTripOrThrow(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + tripId));
    }
}
