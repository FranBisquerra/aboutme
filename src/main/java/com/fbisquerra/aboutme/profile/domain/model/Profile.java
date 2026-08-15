package com.fbisquerra.aboutme.profile.domain.model;

import java.util.List;

public record Profile(
    String name,
    String title,
    String location,
    String email,
    String linkedin,
    String github,
    String bio,
    List<Language> languages,
    List<String> skills,
    List<ExperienceEntry> experience,
    List<EducationEntry> education,
    List<CourseEntry> courses
) {

    public record Language(String name, String level) {
    }

    public record ExperienceEntry(String company, String role, String start, String end, String description) {
    }

    public record EducationEntry(String institution, String degree, String start, String end) {
    }

    public record CourseEntry(String institution, String name, String start, String end) {
    }
}
