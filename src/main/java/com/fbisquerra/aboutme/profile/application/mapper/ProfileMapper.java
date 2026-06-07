package com.fbisquerra.aboutme.profile.application.mapper;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
import com.fbisquerra.aboutme.profile.domain.model.Profile;

public final class ProfileMapper {

    private ProfileMapper() {
    }

    public static ProfileResponse toResponse(Profile profile) {
        return new ProfileResponse(
                profile.name(),
                profile.title(),
                profile.location(),
                profile.email(),
                profile.linkedin(),
                profile.github(),
                profile.bio(),
                profile.languages().stream()
                        .map(l -> new ProfileResponse.Language(l.name(), l.level()))
                        .toList(),
                profile.skills(),
                profile.experience().stream()
                        .map(e -> new ProfileResponse.ExperienceEntry(e.company(), e.role(), e.start(), e.end(), e.description()))
                        .toList(),
                profile.education().stream()
                        .map(e -> new ProfileResponse.EducationEntry(e.institution(), e.degree(), e.start(), e.end()))
                        .toList()
        );
    }
}
