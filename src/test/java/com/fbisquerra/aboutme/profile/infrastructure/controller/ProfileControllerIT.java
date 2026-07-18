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

    // Mirrors V2__seed_profile.sql — used to leave the shared database as the seed left it.
    private static final String SEED_PROFILE_JSON = """
        {
          "name": "Francesc Bisquerra Castell",
          "title": "Software Engineer",
          "location": "Palma de Mallorca",
          "email": "francesc.bisquerra@gmail.com",
          "linkedin": "https://www.linkedin.com/in/franbisquerra",
          "github": "https://github.com/FranBisquerra",
          "bio": "Passionate software engineer who loves learning, sharing knowledge and taking on new challenges. Outside of tech, you'll find me in the mountains, catching waves or exploring the outdoors. I thrive in dynamic environments and value the human side of work — being close to people and building great teams."
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
                .content(SEED_PROFILE_JSON))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturn400OnUpdateWithBlankName() throws Exception {
        mockMvc.perform(put("/api/profile")
                .header("Authorization", "Bearer " + adminToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "name": "",
                      "title": "Software Engineer",
                      "location": "Palma de Mallorca",
                      "email": "francesc.bisquerra@gmail.com",
                      "linkedin": "https://www.linkedin.com/in/franbisquerra",
                      "github": "https://github.com/FranBisquerra",
                      "bio": "A bio"
                    }
                    """))
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldUpdateBasicFieldsAndKeepLists() throws Exception {
        String token = adminToken();
        try {
            mockMvc.perform(put("/api/profile")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {
                          "name": "Updated Name",
                          "title": "Updated Title",
                          "location": "Updated Location",
                          "email": "updated@email.dev",
                          "linkedin": "https://www.linkedin.com/in/updated",
                          "github": "https://github.com/updated",
                          "bio": "Updated bio"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Name")))
                .andExpect(jsonPath("$.title", is("Updated Title")))
                .andExpect(jsonPath("$.skills", not(empty())));

            mockMvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Name")))
                .andExpect(jsonPath("$.bio", is("Updated bio")))
                .andExpect(jsonPath("$.languages", not(empty())))
                .andExpect(jsonPath("$.experience", not(empty())))
                .andExpect(jsonPath("$.education", not(empty())));
        } finally {
            // The MariaDB container is shared across test classes: restore the seed values.
            mockMvc.perform(put("/api/profile")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(SEED_PROFILE_JSON))
                .andExpect(status().isOk());
        }
    }
}
