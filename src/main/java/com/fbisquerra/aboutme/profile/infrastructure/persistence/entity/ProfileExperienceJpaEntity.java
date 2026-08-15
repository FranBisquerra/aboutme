package com.fbisquerra.aboutme.profile.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "profile_experience")
public class ProfileExperienceJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String role;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    protected ProfileExperienceJpaEntity() {
    }

    public ProfileExperienceJpaEntity(String company, String role, String startDate, String endDate, String description) {
        this.company = company;
        this.role = role;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getCompany() {
        return company;
    }

    public String getRole() {
        return role;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public String getDescription() {
        return description;
    }
}
