package com.fbisquerra.aboutme.profile.infrastructure.persistence;

import com.fbisquerra.aboutme.profile.domain.model.Profile;
import com.fbisquerra.aboutme.profile.domain.repository.ProfileRepository;
import com.fbisquerra.aboutme.profile.infrastructure.persistence.entity.ProfileJpaEntity;
import com.fbisquerra.aboutme.profile.infrastructure.persistence.entity.ProfileSkillJpaEntity;
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
        return toDomain(findEntity());
    }

    // Only the basic fields are persisted; the lists stay untouched until they become editable.
    @Override
    @Transactional
    public void save(Profile profile) {
        var entity = findEntity();
        entity.setName(profile.name());
        entity.setTitle(profile.title());
        entity.setLocation(profile.location());
        entity.setEmail(profile.email());
        entity.setLinkedin(profile.linkedin());
        entity.setGithub(profile.github());
        entity.setBio(profile.bio());
        profileJpaRepository.save(entity);
    }

    private ProfileJpaEntity findEntity() {
        return profileJpaRepository.findAll().stream()
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("No profile found in the database"));
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
