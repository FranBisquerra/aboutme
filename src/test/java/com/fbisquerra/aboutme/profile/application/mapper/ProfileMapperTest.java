package com.fbisquerra.aboutme.profile.application.mapper;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
import com.fbisquerra.aboutme.profile.fixtures.ProfileFixture;
import org.junit.jupiter.api.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

class ProfileMapperTest {

    @Test
    void shouldMapScalarFieldsToResponse() {
        ProfileResponse response = ProfileMapper.toResponse(ProfileFixture.validProfile());

        assertThat(response.name(), is("Francesc Bisquerra Castell"));
        assertThat(response.title(), is("Software Engineer"));
        assertThat(response.location(), is("Palma de Mallorca"));
        assertThat(response.email(), is("francesc.bisquerra@gmail.com"));
    }

    @Test
    void shouldMapSkills() {
        ProfileResponse response = ProfileMapper.toResponse(ProfileFixture.validProfile());

        assertThat(response.skills(), hasItem("Java"));
        assertThat(response.skills(), hasItem("Spring Boot"));
    }

    @Test
    void shouldMapLanguages() {
        ProfileResponse response = ProfileMapper.toResponse(ProfileFixture.validProfile());

        assertThat(response.languages(), hasSize(2));
        assertThat(response.languages().getFirst().name(), is("Catalan"));
        assertThat(response.languages().getFirst().level(), is("Native"));
    }

    @Test
    void shouldMapExperiencePreservingNullEndDate() {
        ProfileResponse response = ProfileMapper.toResponse(ProfileFixture.validProfile());

        assertThat(response.experience(), hasSize(1));
        assertThat(response.experience().getFirst().company(), is("Travel Compositor"));
        assertThat(response.experience().getFirst().end(), is(nullValue()));
    }

    @Test
    void shouldMapEducation() {
        ProfileResponse response = ProfileMapper.toResponse(ProfileFixture.validProfile());

        assertThat(response.education(), hasSize(1));
        assertThat(response.education().getFirst().degree(), containsString("Computer Engineering"));
    }
}
