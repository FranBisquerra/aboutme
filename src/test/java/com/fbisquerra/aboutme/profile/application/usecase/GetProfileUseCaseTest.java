package com.fbisquerra.aboutme.profile.application.usecase;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
import com.fbisquerra.aboutme.profile.domain.repository.ProfileRepository;
import com.fbisquerra.aboutme.profile.fixtures.ProfileFixture;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
class GetProfileUseCaseTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private GetProfileUseCase getProfileUseCase;

    @Test
    void shouldReturnProfileFromRepository() {
        doReturn(ProfileFixture.validProfile()).when(profileRepository).get();

        ProfileResponse response = getProfileUseCase.execute();

        assertThat(response.name(), is("Francesc Bisquerra Castell"));
        assertThat(response.title(), is("Software Engineer"));
        assertThat(response.location(), is("Palma de Mallorca"));
    }

    @Test
    void shouldMapSkillsFromProfile() {
        doReturn(ProfileFixture.validProfile()).when(profileRepository).get();

        ProfileResponse response = getProfileUseCase.execute();

        assertThat(response.skills(), hasItem("Java"));
        assertThat(response.skills(), hasItem("Spring Boot"));
    }

    @Test
    void shouldMapLanguagesFromProfile() {
        doReturn(ProfileFixture.validProfile()).when(profileRepository).get();

        ProfileResponse response = getProfileUseCase.execute();

        assertThat(response.languages(), hasSize(2));
        assertThat(response.languages().get(0).name(), is("Catalan"));
    }

    @Test
    void shouldMapExperienceWithNullEndDate() {
        doReturn(ProfileFixture.validProfile()).when(profileRepository).get();

        ProfileResponse response = getProfileUseCase.execute();

        assertThat(response.experience().get(0).company(), is("Travel Compositor"));
        assertThat(response.experience().get(0).end(), is(nullValue()));
    }

    @Test
    void shouldMapEducationFromProfile() {
        doReturn(ProfileFixture.validProfile()).when(profileRepository).get();

        ProfileResponse response = getProfileUseCase.execute();

        assertThat(response.education(), hasSize(1));
        assertThat(response.education().get(0).degree(), containsString("Computer Engineering"));
    }
}
