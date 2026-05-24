package com.fbisquerra.aboutme.profile.fixtures;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
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
                "I consider myself a passionate person.",
                List.of(new Profile.Language("Catalan", "Native"), new Profile.Language("English", "Full Professional")),
                List.of("Java", "Spring Boot", "Docker"),
                List.of(new Profile.ExperienceEntry("Travel Compositor", "Full-stack Developer", "2022-03", null, "Development of a travel application.")),
                List.of(new Profile.EducationEntry("Universitat de les Illes Balears", "Bachelor's Degree in Computer Engineering", "2012", "2019"))
        );
    }

    public static ProfileResponse validProfileResponse() {
        return new ProfileResponse(
                "Francesc Bisquerra Castell",
                "Software Engineer",
                "Palma de Mallorca",
                "francesc.bisquerra@gmail.com",
                "https://www.linkedin.com/in/franbisquerra",
                "I consider myself a passionate person.",
                List.of(new ProfileResponse.Language("Catalan", "Native"), new ProfileResponse.Language("English", "Full Professional")),
                List.of("Java", "Spring Boot", "Docker"),
                List.of(new ProfileResponse.ExperienceEntry("Travel Compositor", "Full-stack Developer", "2022-03", null, "Development of a travel application.")),
                List.of(new ProfileResponse.EducationEntry("Universitat de les Illes Balears", "Bachelor's Degree in Computer Engineering", "2012", "2019"))
        );
    }
}
