package com.fbisquerra.aboutme.profile.infrastructure.controller;

import com.fbisquerra.aboutme.AbstractIntegrationTest;
import com.fbisquerra.aboutme.user.domain.model.Role;
import com.fbisquerra.aboutme.user.domain.model.User;
import com.fbisquerra.aboutme.user.domain.port.AccessTokenIssuer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.json.JsonCompareMode;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class ProfileControllerIT extends AbstractIntegrationTest {

    private static final String VALID_PROFILE_JSON = """
        {
          "name": "Updated Name",
          "title": "Updated Title",
          "location": "Updated Location",
          "email": "updated@email.dev",
          "linkedin": "https://www.linkedin.com/in/updated",
          "github": "https://github.com/updated",
          "bio": "Updated bio",
          "languages": [{"name": "German", "level": "Basic"}],
          "skills": ["Kotlin", "Terraform"],
          "experience": [
            {"company": "Acme QA", "role": "Engineer", "start": "2020-01", "end": "2021-02", "description": "Worked on things."},
            {"company": "Globex QA", "role": "Lead", "start": "2021-03", "end": null, "description": "Still working."}
          ],
          "education": [
            {"institution": "Some University", "degree": "Some Degree", "start": "2010", "end": "2014"}
          ]
        }
        """;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private AccessTokenIssuer accessTokenIssuer;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
            .apply(springSecurity())
            .build();
    }

    private String adminToken() {
        User admin = new User(null, "admin", "admin@test.dev", "irrelevant-hash", Role.ADMIN);
        return accessTokenIssuer.issue(admin).token();
    }

    // The response and the request share the same document shape, so a GET is a restorable snapshot.
    private String currentProfileJson() throws Exception {
        return mockMvc.perform(get("/api/profile"))
            .andReturn().getResponse().getContentAsString();
    }

    private void putProfile(String token, String json) throws Exception {
        mockMvc.perform(put("/api/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isOk());
    }

    @Test
    void shouldReturnOkWithProfileData() throws Exception {
        mockMvc.perform(get("/api/profile"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("$.name").exists())
            .andExpect(jsonPath("$.title").exists())
            .andExpect(jsonPath("$.skills").exists());
    }

    @Test
    void shouldReturnProfileWithCorrectName() throws Exception {
        mockMvc.perform(get("/api/profile"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name", is("Francesc Bisquerra Castell")))
            .andExpect(jsonPath("$.title", is("Software Engineer")));
    }

    @Test
    void shouldReturnProfileWithExperienceAndEducation() throws Exception {
        mockMvc.perform(get("/api/profile"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.experience", not(empty())))
            .andExpect(jsonPath("$.education", not(empty())));
    }

    @Test
    void shouldReturn401OnUpdateWithoutToken() throws Exception {
        mockMvc.perform(put("/api/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_PROFILE_JSON))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturn400OnUpdateWithBlankName() throws Exception {
        mockMvc.perform(put("/api/profile")
                .header("Authorization", "Bearer " + adminToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_PROFILE_JSON.replace("\"name\": \"Updated Name\"", "\"name\": \"\"")))
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400OnUpdateWithMalformedExperienceStartDate() throws Exception {
        mockMvc.perform(put("/api/profile")
                .header("Authorization", "Bearer " + adminToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_PROFILE_JSON.replace("\"start\": \"2020-01\"", "\"start\": \"2020\"")))
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400OnUpdateWithMissingExperienceList() throws Exception {
        mockMvc.perform(put("/api/profile")
                .header("Authorization", "Bearer " + adminToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "name": "Updated Name",
                      "title": "Updated Title",
                      "location": "Updated Location",
                      "email": "updated@email.dev",
                      "linkedin": "https://www.linkedin.com/in/updated",
                      "github": "https://github.com/updated",
                      "bio": "Updated bio",
                      "languages": [],
                      "skills": [],
                      "education": []
                    }
                    """))
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReplaceTheWholeProfileDocument() throws Exception {
        String token = adminToken();
        // The MariaDB container is shared across test classes: restore whatever the seed left.
        String snapshot = currentProfileJson();
        try {
            putProfile(token, VALID_PROFILE_JSON);

            mockMvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Name")))
                .andExpect(jsonPath("$.bio", is("Updated bio")))
                .andExpect(jsonPath("$.skills", contains("Kotlin", "Terraform")))
                .andExpect(jsonPath("$.languages", hasSize(1)))
                .andExpect(jsonPath("$.education", hasSize(1)))
                .andExpect(jsonPath("$.experience", hasSize(2)))
                .andExpect(jsonPath("$.experience[0].company", is("Acme QA")))
                .andExpect(jsonPath("$.experience[1].end", is(nullValue())));
        } finally {
            putProfile(token, snapshot);
        }
    }

    @Test
    void shouldRestoreTheSeedDocumentAfterBeingReplaced() throws Exception {
        String token = adminToken();
        String snapshot = currentProfileJson();

        putProfile(token, VALID_PROFILE_JSON);
        putProfile(token, snapshot);

        mockMvc.perform(get("/api/profile"))
            .andExpect(status().isOk())
            .andExpect(content().json(snapshot, JsonCompareMode.STRICT));
    }
}
