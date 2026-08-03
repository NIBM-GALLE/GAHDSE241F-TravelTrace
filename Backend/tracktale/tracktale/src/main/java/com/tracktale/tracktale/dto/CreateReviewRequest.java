package com.tracktale.tracktale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for creating a new review.
 * Used by POST /api/reviews
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {

    private Long tripId;
    private Long userId;
    private int rating;
    private String comment;
}
