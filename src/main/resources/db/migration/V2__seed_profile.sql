INSERT INTO profile (name, title, location, email, linkedin, github, bio)
VALUES ('Francesc Bisquerra Castell',
        'Software Engineer',
        'Palma de Mallorca',
        'francesc.bisquerra@gmail.com',
        'https://www.linkedin.com/in/franbisquerra',
        'https://github.com/FranBisquerra',
        'Passionate software engineer who loves learning, sharing knowledge and taking on new challenges. Outside of tech, you''ll find me in the mountains, catching waves or exploring the outdoors. I thrive in dynamic environments and value the human side of work — being close to people and building great teams.');

SET
@profile_id = LAST_INSERT_ID();

INSERT INTO profile_language (profile_id, name, level)
VALUES (@profile_id, 'Catalan', 'Native'),
       (@profile_id, 'Spanish', 'Native'),
       (@profile_id, 'English', 'Full Professional');

INSERT INTO profile_skill (profile_id, skill)
VALUES (@profile_id, 'Java'),
       (@profile_id, 'Kotlin'),
       (@profile_id, 'Spring Boot'),
       (@profile_id, 'JavaScript'),
       (@profile_id, 'React'),
       (@profile_id, 'Docker'),
       (@profile_id, 'Kubernetes'),
       (@profile_id, 'AWS'),
       (@profile_id, 'CI/CD'),
       (@profile_id, 'Git'),
       (@profile_id, 'MariaDB');

INSERT INTO profile_experience (profile_id, company, role, start_date, end_date, description)
VALUES (@profile_id, 'Travel Compositor', 'Full-stack Developer', '2022-03', NULL,
        'Design, development and maintenance of a large-scale travel application. Working with Java 17, Kotlin, JavaScript, Docker, CI/CD and Gradle.'),
       (@profile_id, 'Playspace', 'Back-end Developer', '2020-06', '2022-03',
        'Java backend development in monolithic and microservice architecture using Spring framework. AWS infrastructure (DynamoDB, SQS, S3), Docker and Kubernetes. Agile methodologies: Scrum and Kanban.'),
       (@profile_id, 'Travel Compositor', 'Full-stack Developer', '2019-10', '2020-03',
        'Design, development and maintenance of the travel application using Java 17, Kotlin, JavaScript, Docker and Gradle.'),
       (@profile_id, 'Hiberus Tecnología', 'Senior Software Developer', '2018-04', '2019-10',
        'Design, development and maintenance of integrations in the tourism sector, and improvements in the integration engine based on Spring Boot.'),
       (@profile_id, 'Hiberus Tecnología', 'Software Developer', '2017-09', '2018-04',
        'Design, development and maintenance of integrations in the tourism sector based on Spring Boot.'),
       (@profile_id, 'SM2 Software & Services Management', 'Full-stack Developer', '2015-07', '2017-09',
        'Development of new features and maintenance of the PPM application Talaia OpenPPM, using J2EE, jQuery, AngularJS, VueJS and MySQL.');

INSERT INTO profile_education (profile_id, institution, degree, start_year, end_year)
VALUES (@profile_id, 'Universitat de les Illes Balears', 'Bachelor''s Degree in Computer Engineering', '2012', '2019');
