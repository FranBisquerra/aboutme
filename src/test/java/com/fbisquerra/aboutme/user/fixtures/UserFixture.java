package com.fbisquerra.aboutme.user.fixtures;

import com.fbisquerra.aboutme.user.application.dto.LoginRequest;
import com.fbisquerra.aboutme.user.domain.model.Role;
import com.fbisquerra.aboutme.user.domain.model.User;

public class UserFixture {

    public static final String USERNAME = "admin";
    public static final String EMAIL = "admin@test.dev";
    public static final String RAW_PASSWORD = "admin123";
    public static final String PASSWORD_HASH = "$2a$10$hashedpasswordplaceholderforunittests000000000000000000";

    public static User adminUser() {
        return new User(1L, USERNAME, EMAIL, PASSWORD_HASH, Role.ADMIN);
    }

    public static User plainUser() {
        return new User(2L, "john", "john@test.dev", PASSWORD_HASH, Role.USER);
    }

    public static LoginRequest validLogin() {
        return new LoginRequest(USERNAME, RAW_PASSWORD);
    }
}
