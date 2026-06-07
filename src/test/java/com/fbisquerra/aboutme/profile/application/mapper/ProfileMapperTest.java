package com.fbisquerra.aboutme.profile.application.mapper;

import com.fbisquerra.aboutme.profile.application.dto.ProfileResponse;
import com.fbisquerra.aboutme.profile.fixtures.ProfileFixture;
import org.junit.jupiter.api.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;

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
        assertThat(response.languages().get(0).name(), is("Catalan"));
        assertThat(response.languages().get(0).level(), is("Native"));
    }

    @Test
    void shouldMapExperiencePreservingNullEndDate() {
        ProfileResponse response = ProfileMapper.toResponse(ProfileFixture.validProfile());

        assertThat(response.experience(), hasSize(1));
        assertThat(response.experience().get(0).company(), is("Travel Compositor"));
        assertThat(response.experience().get(0).end(), is(nullValue()));
    }

    @Test
    void shouldMapEducation() {
        ProfileResponse response = ProfileMapper.toResponse(ProfileFixture.validProfile());

        assertThat(response.education(), hasSize(1));
        assertThat(response.education().get(0).degree(), containsString("Computer Engineering"));
    }
}
