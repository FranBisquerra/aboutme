package com.fbisquerra.aboutme.profile.infrastructure.persistence.entity;

import jakarta.persistence.*;

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
    @JoinColumn(name = "profile_id", nullable = false)
    @OrderBy("id ASC")
    private List<ProfileLanguageJpaEntity> languages = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id", nullable = false)
    @OrderBy("id ASC")
    private List<ProfileSkillJpaEntity> skills = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id", nullable = false)
    @OrderBy("id ASC")
    private List<ProfileExperienceJpaEntity> experience = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id", nullable = false)
    @OrderBy("id ASC")
    private List<ProfileEducationJpaEntity> education = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id", nullable = false)
    @OrderBy("id ASC")
    private List<ProfileCourseJpaEntity> courses = new ArrayList<>();

    protected ProfileJpaEntity() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
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

    public List<ProfileCourseJpaEntity> getCourses() {
        return courses;
    }
}
