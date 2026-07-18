# /it-test — Write a Backend Integration Test

Guide for writing integration tests (full HTTP request → response) using MockMvc.

## Location & naming

```
src/test/java/com/fbisquerra/aboutme/
└── {module}/infrastructure/controller/{Aggregate}ControllerIT.java
```

Integration tests end in `IT`; unit tests end in `Test`.

## Setup — the three pieces every IT needs

1. **Extend `AbstractIntegrationTest`** — starts a singleton Testcontainers MariaDB
   (shared across all IT classes) and points the datasource at it. Flyway applies the
   real migrations, so tests run against the production schema. **Docker must be running.**
2. **`@SpringBootTest`** — full Spring context.
3. **Manual MockMvc** — `@AutoConfigureMockMvc` does not exist in Spring Boot 4.
   Add `.apply(springSecurity())` — without it the security filter chain is not applied,
   and every endpoint is protected by default (`anyRequest().hasRole("ADMIN")`), so tests
   would pass against security behavior that doesn't exist in production.

```java
@SpringBootTest
class ProfileControllerIT extends AbstractIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
            .apply(springSecurity())
            .build();
    }
}
```

## Example

```java
@Test
void shouldReturnProfileWithHttpOk() throws Exception {
    mockMvc.perform(get("/api/profile")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Fran Bisquerra"));
}
```

For a protected endpoint, issue a real token through the domain port and send it as a header —
this exercises the actual JWT decoding path instead of mocking the authentication:

```java
@Autowired
private AccessTokenIssuer accessTokenIssuer;

private String adminToken() {
    User admin = new User(null, "admin", "admin@test.dev", "irrelevant-hash", Role.ADMIN);
    return accessTokenIssuer.issue(admin).token();
}

// .header("Authorization", "Bearer " + adminToken())
```

Also assert the unauthenticated call returns 401 and (if relevant) a non-admin token returns 403.

## Rules

- Always go through HTTP (MockMvc) — never call use cases or repositories directly
- **The MariaDB container is shared across all IT classes** (singleton pattern) and Flyway
  seeds it once. A test that mutates seed data must restore it (e.g. in a `finally` block,
  PUT-ing the original values back) or it breaks sibling tests depending on execution order
- Validate the full request → response flow: status code, response body shape
- For protected endpoints, test both the authenticated and unauthenticated paths
- Test naming follows the same functional convention as unit tests
- Keep IT tests focused on the HTTP contract, not business logic (that belongs in unit tests)
