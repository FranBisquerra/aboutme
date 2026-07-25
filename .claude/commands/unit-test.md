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

Structure every test in three phases — arrange, act, assert — but express them as
**blocks separated by a blank line**, not with literal `// ARRANGE` / `// ACT` / `// ASSERT`
markers. The separation should be visual; the phases are obvious from the code.

```java
@Test
void shouldLoadProfileSuccessfully() {
    var profile = ProfileFixture.validProfile();
    doReturn(profile).when(profileRepository).get();

    var result = getProfileUseCase.execute();

    assertThat(result.name(), is(profile.name()));
}
```

Add a comment only to explain something the code cannot show (a non-obvious setup, a
gotcha) — never just to label a phase.

To assert what a use case passes to a mocked port, capture it:
`var captor = ArgumentCaptor.forClass(Profile.class); verify(profileRepository).save(captor.capture());`

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
