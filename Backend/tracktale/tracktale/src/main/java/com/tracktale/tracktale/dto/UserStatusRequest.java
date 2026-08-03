package com.tracktale.tracktale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for updating a user's status (ACTIVE / SUSPENDED).
 * Used by the admin dashboard.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusRequest {

    private String status;
}
