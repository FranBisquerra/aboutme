package com.fbisquerra.aboutme.user.infrastructure.controller;

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

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
    "JWT_SECRET=test-secret-test-secret-test-secret-0123456789",
    "ADMIN_USERNAME=admin",
    "ADMIN_EMAIL=admin@test.dev",
    "ADMIN_PASSWORD=admin"
})
class AuthControllerIT extends AbstractIntegrationTest {

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

    @Test
    void shouldReturnTokenOnValidLogin() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    { "username": "admin", "password": "admin" }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.tokenType").value("Bearer"))
            .andExpect(jsonPath("$.expiresIn").value(3600));
    }

    @Test
    void shouldReturn401OnInvalidCredentials() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    { "username": "admin", "password": "wrong" }
                    """))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturn400OnMissingCredentials() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    { "username": "admin", "password": "" }
                    """))
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn401OnProtectedRouteWithoutToken() throws Exception {
        mockMvc.perform(post("/api/profile"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturn403OnProtectedRouteWithUserRole() throws Exception {
        User plainUser = new User(null, "john", "john@test.dev", "irrelevant-hash", Role.USER);
        String token = accessTokenIssuer.issue(plainUser).token();

        mockMvc.perform(post("/api/profile")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isForbidden());
    }

    @Test
    void shouldKeepProfileReadPublic() throws Exception {
        mockMvc.perform(get("/api/profile"))
            .andExpect(status().isOk());
    }
}
