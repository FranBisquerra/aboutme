package com.fbisquerra.aboutme.profile.application.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.List;

public record UpdateProfileRequest(
    @NotBlank String name,
    @NotBlank String title,
    @NotBlank String location,
    @NotBlank @Email String email,
    @NotBlank String linkedin,
    @NotBlank String github,
    @NotBlank String bio,
    @NotNull @Valid List<Language> languages,
    @NotNull List<@NotBlank String> skills,
    @NotNull @Valid List<ExperienceEntry> experience,
    @NotNull @Valid List<EducationEntry> education,
    @NotNull @Valid List<CourseEntry> courses) {

    public record Language(
        @NotBlank String name,
        @NotBlank String level) {
    }

    public record ExperienceEntry(
        @NotBlank String company,
        @NotBlank String role,
        @NotBlank @Pattern(regexp = "\\d{4}-\\d{2}") String start,
        @Pattern(regexp = "\\d{4}-\\d{2}") String end,
        @NotBlank String description) {
    }

    public record EducationEntry(
        @NotBlank String institution,
        @NotBlank String degree,
        @NotBlank @Pattern(regexp = "\\d{4}") String start,
        @NotBlank @Pattern(regexp = "\\d{4}") String end) {
    }

    public record CourseEntry(
        @NotBlank String institution,
        @NotBlank String name,
        @NotBlank @Pattern(regexp = "\\d{4}") String start,
        @Pattern(regexp = "\\d{4}") String end) {
    }
}
