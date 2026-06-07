package com.fbisquerra.aboutme.profile.infrastructure.persistence;

import com.fbisquerra.aboutme.profile.domain.model.Profile;
import com.fbisquerra.aboutme.profile.domain.repository.ProfileRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class JpaProfileRepository implements ProfileRepository {

    private final ProfileJpaRepository profileJpaRepository;

    public JpaProfileRepository(ProfileJpaRepository profileJpaRepository) {
        this.profileJpaRepository = profileJpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Profile get() {
        ProfileJpaEntity entity = profileJpaRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No profile found in the database"));
        return toDomain(entity);
    }

    private Profile toDomain(ProfileJpaEntity entity) {
        return new Profile(
                entity.getName(),
                entity.getTitle(),
                entity.getLocation(),
                entity.getEmail(),
                entity.getLinkedin(),
                entity.getGithub(),
                entity.getBio(),
                entity.getLanguages().stream()
                        .map(l -> new Profile.Language(l.getName(), l.getLevel()))
                        .toList(),
                entity.getSkills().stream()
                        .map(ProfileSkillJpaEntity::getSkill)
                        .toList(),
                entity.getExperience().stream()
                        .map(e -> new Profile.ExperienceEntry(e.getCompany(), e.getRole(), e.getStartDate(), e.getEndDate(), e.getDescription()))
                        .toList(),
                entity.getEducation().stream()
                        .map(e -> new Profile.EducationEntry(e.getInstitution(), e.getDegree(), e.getStartYear(), e.getEndYear()))
                        .toList()
        );
    }
}
