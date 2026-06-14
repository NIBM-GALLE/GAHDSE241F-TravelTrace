package com.tracktale.tracktale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for creating a new User.
 * Used by the mobile app registration flow and the demo seed endpoint.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {

    private String username;
    private String email;
    private String password;
}
