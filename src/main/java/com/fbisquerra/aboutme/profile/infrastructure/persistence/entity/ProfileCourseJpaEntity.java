package com.fbisquerra.aboutme.profile.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "profile_course")
public class ProfileCourseJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String institution;
    private String name;

    @Column(name = "start_year")
    private String startYear;

    @Column(name = "end_year")
    private String endYear;

    protected ProfileCourseJpaEntity() {
    }

    public ProfileCourseJpaEntity(String institution, String name, String startYear, String endYear) {
        this.institution = institution;
        this.name = name;
        this.startYear = startYear;
        this.endYear = endYear;
    }

    public Long getId() {
        return id;
    }

    public String getInstitution() {
        return institution;
    }

    public String getName() {
        return name;
    }

    public String getStartYear() {
        return startYear;
    }

    public String getEndYear() {
        return endYear;
    }
}
