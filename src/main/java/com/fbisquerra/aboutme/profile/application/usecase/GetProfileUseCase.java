package com.fbisquerra.aboutme.profile.application.usecase;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
import com.fbisquerra.aboutme.profile.domain.model.Profile;
import com.fbisquerra.aboutme.profile.domain.repository.ProfileRepository;
import org.springframework.stereotype.Component;

@Component
public class GetProfileUseCase {

    private final ProfileRepository profileRepository;

    public GetProfileUseCase(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public ProfileResponse execute() {
        Profile profile = profileRepository.get();
        return mapToResponse(profile);
    }

    private ProfileResponse mapToResponse(Profile profile) {
        return new ProfileResponse(
                profile.name(),
                profile.title(),
                profile.location(),
                profile.email(),
                profile.linkedin(),
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
