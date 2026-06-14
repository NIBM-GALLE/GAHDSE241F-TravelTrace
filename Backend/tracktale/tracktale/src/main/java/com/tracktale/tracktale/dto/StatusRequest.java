package com.tracktale.tracktale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for updating a trip's status.
 * e.g. { "status": "COMPLETED" }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusRequest {

    /** New status string — must match a {@link com.tracktale.tracktale.model.TripStatus} name. */
    private String status;
}
