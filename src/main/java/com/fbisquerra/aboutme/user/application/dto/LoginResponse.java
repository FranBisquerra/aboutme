package com.fbisquerra.aboutme.user.application.dto;

public record LoginResponse(String token, String tokenType, long expiresIn) {
}
