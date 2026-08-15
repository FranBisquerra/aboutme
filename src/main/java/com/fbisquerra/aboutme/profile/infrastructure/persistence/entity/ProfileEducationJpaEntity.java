package com.fbisquerra.aboutme.profile.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "profile_education")
public class ProfileEducationJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String institution;
    private String degree;

    @Column(name = "start_year")
    private String startYear;

    @Column(name = "end_year")
    private String endYear;

    protected ProfileEducationJpaEntity() {
    }

    public ProfileEducationJpaEntity(String institution, String degree, String startYear, String endYear) {
        this.institution = institution;
        this.degree = degree;
        this.startYear = startYear;
        this.endYear = endYear;
    }

    public Long getId() {
        return id;
    }

    public String getInstitution() {
        return institution;
    }

    public String getDegree() {
        return degree;
    }

    public String getStartYear() {
        return startYear;
    }

    public String getEndYear() {
        return endYear;
    }
}
