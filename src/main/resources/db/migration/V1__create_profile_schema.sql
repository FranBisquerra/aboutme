CREATE TABLE profile
(
    id       BIGINT       NOT NULL AUTO_INCREMENT,
    name     VARCHAR(255) NOT NULL,
    title    VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL,
    linkedin VARCHAR(255) NOT NULL,
    github   VARCHAR(255) NOT NULL,
    bio      TEXT         NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE profile_language
(
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    profile_id BIGINT       NOT NULL,
    name       VARCHAR(255) NOT NULL,
    level      VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_profile_language_profile FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE profile_skill
(
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    profile_id BIGINT       NOT NULL,
    skill      VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_profile_skill_profile FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE profile_experience
(
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    profile_id  BIGINT       NOT NULL,
    company     VARCHAR(255) NOT NULL,
    role        VARCHAR(255) NOT NULL,
    start_date  VARCHAR(32)  NOT NULL,
    end_date    VARCHAR(32) NULL,
    description TEXT         NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_profile_experience_profile FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE profile_education
(
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    profile_id  BIGINT       NOT NULL,
    institution VARCHAR(255) NOT NULL,
    degree      VARCHAR(255) NOT NULL,
    start_year  VARCHAR(32)  NOT NULL,
    end_year    VARCHAR(32)  NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_profile_education_profile FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE
) ENGINE = InnoDB;
