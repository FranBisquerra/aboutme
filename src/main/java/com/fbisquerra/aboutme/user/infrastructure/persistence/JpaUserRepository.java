package com.fbisquerra.aboutme.user.infrastructure.persistence;

import com.fbisquerra.aboutme.user.domain.model.User;
import com.fbisquerra.aboutme.user.domain.repository.UserRepository;
import com.fbisquerra.aboutme.user.infrastructure.persistence.entity.UserJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
public class JpaUserRepository implements UserRepository {

    private final UserJpaRepository userJpaRepository;

    public JpaUserRepository(UserJpaRepository userJpaRepository) {
        this.userJpaRepository = userJpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userJpaRepository.findByUsername(username).map(this::toDomain);
    }

    @Override
    @Transactional
    public User save(User user) {
        var saved = userJpaRepository.save(toEntity(user));
        return toDomain(saved);
    }

    private User toDomain(UserJpaEntity entity) {
        return new User(
            entity.getId(),
            entity.getUsername(),
            entity.getEmail(),
            entity.getPasswordHash(),
            entity.getRole()
        );
    }

    private UserJpaEntity toEntity(User user) {
        return new UserJpaEntity(
            user.id(),
            user.username(),
            user.email(),
            user.passwordHash(),
            user.role()
        );
    }
}
