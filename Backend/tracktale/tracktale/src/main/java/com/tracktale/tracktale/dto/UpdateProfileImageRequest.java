package com.tracktale.tracktale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for updating a user's profile image.
 * Contains the Cloudinary URL of the uploaded image.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileImageRequest {

    private String profileImageUrl;
}
