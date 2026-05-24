package com.fbisquerra.aboutme.profile.infrastructure.persistence;

import com.fbisquerra.aboutme.profile.domain.model.Profile;
import com.fbisquerra.aboutme.profile.domain.repository.ProfileRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
public class JsonProfileRepository implements ProfileRepository {

    private final ObjectMapper objectMapper;

    public JsonProfileRepository(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Profile get() {
        try {
            ClassPathResource resource = new ClassPathResource("data/profile.json");
            return objectMapper.readValue(resource.getInputStream(), Profile.class);
        } catch (IOException e) {
            throw new RuntimeException("Could not load profile data", e);
        }
    }
}
