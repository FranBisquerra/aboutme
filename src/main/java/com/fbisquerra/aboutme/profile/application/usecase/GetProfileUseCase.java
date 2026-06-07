package com.fbisquerra.aboutme.profile.application.usecase;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
import com.fbisquerra.aboutme.profile.application.mapper.ProfileMapper;
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
        return ProfileMapper.toResponse(profile);
    }
}
