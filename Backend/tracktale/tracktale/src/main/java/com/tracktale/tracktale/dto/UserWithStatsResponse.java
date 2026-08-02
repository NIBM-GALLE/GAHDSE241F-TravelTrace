package com.tracktale.tracktale.dto;

import com.tracktale.tracktale.model.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO that includes user details along with trip statistics.
 * Used by the admin dashboard User Management page.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserWithStatsResponse {

    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String address;
    private String profileImageUrl;
    private UserStatus status;

    // Trip statistics
    private long totalTrips;
    private long ongoingTrips;
    private long completedTrips;
    private long plannedTrips;
}
