CREATE TABLE profile_course (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    profile_id  BIGINT       NOT NULL,
    institution VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    start_year  VARCHAR(32)  NOT NULL,
    end_year    VARCHAR(32)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_profile_course_profile FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE
) ENGINE = InnoDB;
