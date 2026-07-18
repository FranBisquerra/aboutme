package com.fbisquerra.aboutme.profile.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
    @NotBlank String name,
    @NotBlank String title,
    @NotBlank String location,
    @NotBlank @Email String email,
    @NotBlank String linkedin,
    @NotBlank String github,
    @NotBlank String bio) {
}
