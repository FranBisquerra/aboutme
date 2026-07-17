# /unit-test — Write a Backend Unit Test

Guide for writing unit tests in the Java backend following project conventions.

## Test Structure

```
src/test/java/com/fbisquerra/aboutme/
└── {module}/
    ├── domain/
    │   ├── model/       → {Aggregate}Test.java, {VO}Test.java
    │   └── service/     → {Feature}DomainServiceTest.java
    ├── application/
    │   └── usecase/     → {Action}UseCaseTest.java
    └── fixtures/        → {Entity}Fixture.java
```

## Frameworks

- **JUnit 5** (Jupiter) — test runner
- **Mockito** — mocks (configured as `-javaagent` in build.gradle — Java 26 requirement)
- **Hamcrest** — assertions

## Rules by layer

**Domain layer** (`domain/`):

- No `@SpringBootTest`, no Spring annotations whatsoever
- Do not mock internal domain dependencies
- Test business rules, Value Object validations, Aggregate behavior

**Application layer** (`application/usecase/`):

- Use `@ExtendWith(MockitoExtension.class)`
- Mock repositories and domain services
- Use `doReturn(...).when(mock).method()` syntax — NOT `when(...).thenReturn(...)`
- Test orchestration logic and DTO mapping

## Test structure: Arrange-Act-Assert

```java
@Test
void shouldLoadProfileSuccessfully() {
    // ARRANGE
    var profile = ProfileFixture.validProfile();
    doReturn(Optional.of(profile)).when(profileRepository).findById(profile.getId());

    // ACT
    var result = getProfileUseCase.execute(profile.getId());

    // ASSERT
    assertThat(result.name(), is(profile.getName()));
}
```

## Naming — functional, not technical

```
shouldSuccessfullyRegisterUserWithValidEmail()
shouldThrowExceptionWhenEmailAlreadyExists()
shouldReturnUnauthorizedWhenPasswordIsWrong()
```

## Fixtures — Factory Methods

```java
public class ProfileFixture {
    public static Profile validProfile() { ... }
    public static Profile profileWithoutBio() { ... }
}
```

- One fixture class per aggregate
- Descriptive factory method names
- Do NOT write unit tests for fixtures themselves

## Conventions

- One test per expected behavior
- Independent tests — no shared mutable state between tests
- No `Thread.sleep()`
- No magic values — use fixtures
- Do not test trivial getters/setters
