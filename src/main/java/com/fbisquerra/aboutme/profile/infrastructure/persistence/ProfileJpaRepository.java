package com.fbisquerra.aboutme.profile.infrastructure.persistence;

import com.fbisquerra.aboutme.profile.infrastructure.persistence.entity.ProfileJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileJpaRepository extends JpaRepository<ProfileJpaEntity, Long> {
}
