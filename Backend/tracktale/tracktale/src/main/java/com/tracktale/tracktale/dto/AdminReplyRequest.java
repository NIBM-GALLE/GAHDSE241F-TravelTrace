package com.tracktale.tracktale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for admin replying to a review.
 * Used by PATCH /api/reviews/{id}/reply
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminReplyRequest {

    private String adminReply;
}
