package com.fbisquerra.aboutme.profile.fixtures;

import com.fbisquerra.aboutme.profile.application.dto.UpdateProfileRequest;
import com.fbisquerra.aboutme.profile.domain.model.Profile;

import java.util.List;

public class ProfileFixture {

    public static Profile validProfile() {
        return new Profile(
            "Francesc Bisquerra Castell",
            "Software Engineer",
            "Palma de Mallorca",
            "francesc.bisquerra@gmail.com",
            "https://www.linkedin.com/in/franbisquerra",
            "https://github.com/FranBisquerra",
            "I consider myself a passionate person.",
            List.of(new Profile.Language("Catalan", "Native"), new Profile.Language("English", "Full Professional")),
            List.of("Java", "Spring Boot", "Docker"),
            List.of(new Profile.ExperienceEntry("Travel Compositor", "Full-stack Developer", "2022-03", null, "Development of a travel application.")),
            List.of(new Profile.EducationEntry("Universitat de les Illes Balears", "Bachelor's Degree in Computer Engineering", "2012", "2019")),
            List.of(new Profile.CourseEntry("Udemy", "Docker Mastery", "2021", null))
        );
    }

    public static UpdateProfileRequest validRequest() {
        return new UpdateProfileRequest(
            "New Name",
            "New Title",
            "New Location",
            "new@email.dev",
            "https://www.linkedin.com/in/new",
            "https://github.com/new",
            "New bio",
            List.of(new UpdateProfileRequest.Language("German", "Basic")),
            List.of("Kotlin"),
            List.of(new UpdateProfileRequest.ExperienceEntry("Acme", "Engineer", "2020-01", null, "Did things.")),
            List.of(new UpdateProfileRequest.EducationEntry("Some University", "Some Degree", "2010", "2014")),
            List.of(new UpdateProfileRequest.CourseEntry("Coursera", "Machine Learning", "2018", null))
        );
    }
}
