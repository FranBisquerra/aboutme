package com.fbisquerra.aboutme.profile.application.usecase;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
import com.fbisquerra.aboutme.profile.application.dto.UpdateProfileRequest;
import com.fbisquerra.aboutme.profile.application.mapper.ProfileMapper;
import com.fbisquerra.aboutme.profile.domain.model.Profile;
import com.fbisquerra.aboutme.profile.domain.repository.ProfileRepository;
import org.springframework.stereotype.Component;

@Component
public class UpdateProfileUseCase {

    private final ProfileRepository profileRepository;

    public UpdateProfileUseCase(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public ProfileResponse execute(UpdateProfileRequest request) {
        var updated = new Profile(
            request.name(),
            request.title(),
            request.location(),
            request.email(),
            request.linkedin(),
            request.github(),
            request.bio(),
            request.languages().stream()
                .map(l -> new Profile.Language(l.name(), l.level()))
                .toList(),
            request.skills(),
            request.experience().stream()
                .map(e -> new Profile.ExperienceEntry(e.company(), e.role(), e.start(), e.end(), e.description()))
                .toList(),
            request.education().stream()
                .map(e -> new Profile.EducationEntry(e.institution(), e.degree(), e.start(), e.end()))
                .toList(),
            request.courses().stream()
                .map(c -> new Profile.CourseEntry(c.institution(), c.name(), c.start(), c.end()))
                .toList()
        );
        profileRepository.save(updated);
        return ProfileMapper.toResponse(updated);
    }
}
