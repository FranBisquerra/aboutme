package com.fbisquerra.aboutme.user.infrastructure.security;

import com.fbisquerra.aboutme.user.domain.port.PasswordHasher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SpringPasswordHasher implements PasswordHasher {

    private final PasswordEncoder passwordEncoder;

    public SpringPasswordHasher(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String hash(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    @Override
    public boolean matches(String rawPassword, String passwordHash) {
        return passwordEncoder.matches(rawPassword, passwordHash);
    }
}
