package com.fbisquerra.aboutme.profile.application.usecase;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
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
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UpdateProfileUseCaseTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private UpdateProfileUseCase updateProfileUseCase;

    @Test
    void shouldSaveTheWholeProfileDocument() {
        ProfileResponse response = updateProfileUseCase.execute(ProfileFixture.validRequest());

        Profile saved = savedProfile();
        assertThat(saved.name(), is("New Name"));
        assertThat(saved.title(), is("New Title"));
        assertThat(saved.bio(), is("New bio"));
        assertThat(response.name(), is("New Name"));
    }

    @Test
    void shouldReplaceTheListsWithTheOnesInTheRequest() {
        updateProfileUseCase.execute(ProfileFixture.validRequest());

        Profile saved = savedProfile();
        assertThat(saved.languages(), contains(new Profile.Language("German", "Basic")));
        assertThat(saved.skills(), contains("Kotlin"));
        assertThat(saved.experience(), contains(
            new Profile.ExperienceEntry("Acme", "Engineer", "2020-01", null, "Did things.")));
        assertThat(saved.education(), contains(
            new Profile.EducationEntry("Some University", "Some Degree", "2010", "2014")));
        assertThat(saved.courses(), contains(
            new Profile.CourseEntry("Coursera", "Machine Learning", "2018", null)));
    }

    @Test
    void shouldKeepANullEndDateForTheCurrentJob() {
        updateProfileUseCase.execute(ProfileFixture.validRequest());

        assertThat(savedProfile().experience().getFirst().end(), is(nullValue()));
    }

    private Profile savedProfile() {
        ArgumentCaptor<Profile> captor = ArgumentCaptor.forClass(Profile.class);
        verify(profileRepository).save(captor.capture());
        return captor.getValue();
    }
}
