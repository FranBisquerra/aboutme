package com.fbisquerra.aboutme.user.infrastructure.config;

import com.fbisquerra.aboutme.user.domain.model.Role;
import com.fbisquerra.aboutme.user.domain.model.User;
import com.fbisquerra.aboutme.user.domain.port.PasswordHasher;
import com.fbisquerra.aboutme.user.domain.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserInitializer.class);

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final String username;
    private final String email;
    private final String password;

    public AdminUserInitializer(UserRepository userRepository,
                                PasswordHasher passwordHasher,
                                @Value("${app.security.admin.username:}") String username,
                                @Value("${app.security.admin.email:}") String email,
                                @Value("${app.security.admin.password:}") String password) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (username.isBlank() || email.isBlank() || password.isBlank()) {
            log.info("Admin bootstrap skipped: no admin credentials configured");
            return;
        }
        if (userRepository.findByUsername(username).isPresent()) {
            log.info("Admin user '{}' already exists; skipping bootstrap", username);
            return;
        }
        userRepository.save(new User(null, username, email, passwordHasher.hash(password), Role.ADMIN));
        log.info("Created admin user '{}'", username);
    }
}
