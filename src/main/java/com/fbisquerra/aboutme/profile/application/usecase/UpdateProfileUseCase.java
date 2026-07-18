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

    // Only the basic fields are editable for now; lists are carried over unchanged.
    public ProfileResponse execute(UpdateProfileRequest request) {
        var current = profileRepository.get();
        var updated = new Profile(
            request.name(),
            request.title(),
            request.location(),
            request.email(),
            request.linkedin(),
            request.github(),
            request.bio(),
            current.languages(),
            current.skills(),
            current.experience(),
            current.education()
        );
        profileRepository.save(updated);
        return ProfileMapper.toResponse(updated);
    }
}
