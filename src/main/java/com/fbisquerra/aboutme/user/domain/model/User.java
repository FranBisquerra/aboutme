package com.fbisquerra.aboutme.user.domain.model;

public record User(Long id, String username, String email, String passwordHash, Role role) {

    public User {
        if (username == null || username.isBlank()) throw new IllegalArgumentException("Username is required");
        if (email == null || email.isBlank()) throw new IllegalArgumentException("Email is required");
        if (passwordHash == null || passwordHash.isBlank()) throw new IllegalArgumentException("Password hash is required");
        if (role == null) throw new IllegalArgumentException("Role is required");
    }
}
