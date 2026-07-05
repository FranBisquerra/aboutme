package com.fbisquerra.aboutme.profile.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "profile_skill")
public class ProfileSkillJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String skill;

    protected ProfileSkillJpaEntity() {
    }

    public Long getId() {
        return id;
    }

    public String getSkill() {
        return skill;
    }
}
