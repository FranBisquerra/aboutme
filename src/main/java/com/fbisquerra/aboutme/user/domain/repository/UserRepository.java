package com.fbisquerra.aboutme.user.domain.repository;

import com.fbisquerra.aboutme.user.domain.model.User;

import java.util.Optional;

public interface UserRepository {

    Optional<User> findByUsername(String username);

    User save(User user);
}
