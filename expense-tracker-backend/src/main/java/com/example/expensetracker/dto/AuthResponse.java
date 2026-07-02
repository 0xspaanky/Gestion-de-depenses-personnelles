package com.example.expensetracker.dto;

/**
 * Returned after a successful register or login: the JWT plus basic user info.
 */
public class AuthResponse {

    private String token;
    private String username;
    private String email;

    public AuthResponse(String token, String username, String email) {
        this.token = token;
        this.username = username;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }
}
