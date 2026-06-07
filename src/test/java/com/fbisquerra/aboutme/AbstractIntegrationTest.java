package com.fbisquerra.aboutme;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MariaDBContainer;

/**
 * Base class for integration tests that need the full Spring context.
 *
 * <p>Spins up a single MariaDB container (reused across all test classes — the
 * singleton container pattern) and points the datasource at it. Flyway applies the
 * real migrations on context startup, so tests run against the same schema as production.
 */
public abstract class AbstractIntegrationTest {

    static final MariaDBContainer<?> MARIADB = new MariaDBContainer<>("mariadb:11.4");

    static {
        MARIADB.start();
    }

    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MARIADB::getJdbcUrl);
        registry.add("spring.datasource.username", MARIADB::getUsername);
        registry.add("spring.datasource.password", MARIADB::getPassword);
    }
}
