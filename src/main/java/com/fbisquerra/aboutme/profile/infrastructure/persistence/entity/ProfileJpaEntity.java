package com.fbisquerra.aboutme.profile.infrastructure.persistence.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "profile")
public class ProfileJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String title;
    private String location;
    private String email;
    private String linkedin;
    private String github;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id")
    @OrderBy("id ASC")
    private List<ProfileLanguageJpaEntity> languages = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id")
    @OrderBy("id ASC")
    private List<ProfileSkillJpaEntity> skills = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id")
    @OrderBy("id ASC")
    private List<ProfileExperienceJpaEntity> experience = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id")
    @OrderBy("id ASC")
    private List<ProfileEducationJpaEntity> education = new ArrayList<>();

    protected ProfileJpaEntity() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }

    public String getEmail() {
        return email;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public String getGithub() {
        return github;
    }

    public String getBio() {
        return bio;
    }

    public List<ProfileLanguageJpaEntity> getLanguages() {
        return languages;
    }

    public List<ProfileSkillJpaEntity> getSkills() {
        return skills;
    }

    public List<ProfileExperienceJpaEntity> getExperience() {
        return experience;
    }

    public List<ProfileEducationJpaEntity> getEducation() {
        return education;
    }
}
