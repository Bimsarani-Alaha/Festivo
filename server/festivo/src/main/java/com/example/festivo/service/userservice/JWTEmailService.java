package com.example.festivo.service.userservice;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JWTEmailService {

    private final JWTUtils jwtUtils;

    public JWTEmailService(JWTUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    /**
     * Extracts email/username from JWT token
     * @param token JWT token string
     * @return email/username contained in the token
     */
    public String extractEmailFromToken(String token) {
        return jwtUtils.extractUserName(token);
    }

    /**
     * Validates if the token belongs to the given user details
     * @param token JWT token
     * @param userDetails User details to validate against
     * @return true if token is valid for this user
     */
    public boolean isTokenValidForEmail(String token, UserDetails userDetails) {
        return jwtUtils.isTokenValid(token, userDetails);
    }

    /**
     * Checks if token is expired
     * @param token JWT token
     * @return true if token is expired
     */
    public boolean isTokenExpired(String token) {
        return jwtUtils.isTokenExpired(token);
    }
}