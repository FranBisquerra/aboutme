package com.fbisquerra.aboutme.profile.application.usecase;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
import com.fbisquerra.aboutme.profile.domain.model.Profile;
import com.fbisquerra.aboutme.profile.domain.repository.ProfileRepository;
import com.fbisquerra.aboutme.profile.fixtures.ProfileFixture;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class GetProfileUseCaseTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private GetProfileUseCase getProfileUseCase;

    // Orchestration only: fetch from the repository and return the mapped response.
    // Exhaustive field-by-field mapping is covered by ProfileMapperTest.
    @Test
    void shouldReturnProfileFromRepositoryMappedToResponse() {
        // ARRANGE
        Profile profile = ProfileFixture.validProfile();
        doReturn(profile).when(profileRepository).get();

        // ACT
        ProfileResponse response = getProfileUseCase.execute();

        // ASSERT
        assertThat(response.name(), is(profile.name()));
        verify(profileRepository).get();
    }
}
