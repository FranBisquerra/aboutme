package com.fbisquerra.aboutme.profile.application.usecase;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
import com.fbisquerra.aboutme.profile.application.dto.UpdateProfileRequest;
import com.fbisquerra.aboutme.profile.domain.model.Profile;
import com.fbisquerra.aboutme.profile.domain.repository.ProfileRepository;
import com.fbisquerra.aboutme.profile.fixtures.ProfileFixture;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UpdateProfileUseCaseTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private UpdateProfileUseCase updateProfileUseCase;

    @Test
    void shouldSaveBasicFieldsAndPreserveLists() {
        // ARRANGE
        Profile current = ProfileFixture.validProfile();
        doReturn(current).when(profileRepository).get();
        UpdateProfileRequest request = new UpdateProfileRequest(
            "New Name", "New Title", "New Location", "new@email.dev",
            "https://www.linkedin.com/in/new", "https://github.com/new", "New bio");

        // ACT
        ProfileResponse response = updateProfileUseCase.execute(request);

        // ASSERT
        ArgumentCaptor<Profile> captor = ArgumentCaptor.forClass(Profile.class);
        verify(profileRepository).save(captor.capture());
        Profile saved = captor.getValue();
        assertThat(saved.name(), is("New Name"));
        assertThat(saved.title(), is("New Title"));
        assertThat(saved.bio(), is("New bio"));
        assertThat(saved.languages(), is(current.languages()));
        assertThat(saved.skills(), is(current.skills()));
        assertThat(saved.experience(), is(current.experience()));
        assertThat(saved.education(), is(current.education()));
        assertThat(response.name(), is("New Name"));
    }
}
