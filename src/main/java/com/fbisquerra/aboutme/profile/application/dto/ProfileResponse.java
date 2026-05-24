package com.fbisquerra.aboutme.profile.application.dto;

import java.util.List;

public record ProfileResponse(
        String name,
        String title,
        String location,
        String email,
        String linkedin,
        String bio,
        List<Language> languages,
        List<String> skills,
        List<ExperienceEntry> experience,
        List<EducationEntry> education
) {

    public record Language(String name, String level) {}

    public record ExperienceEntry(String company, String role, String start, String end, String description) {}

    public record EducationEntry(String institution, String degree, String start, String end) {}
}
