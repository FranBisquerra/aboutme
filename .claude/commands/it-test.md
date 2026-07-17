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

For a protected endpoint, authenticate the request (e.g. `.with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))`
from `SecurityMockMvcRequestPostProcessors`) and also assert the unauthenticated call returns 401/403.

## Rules

- Always go through HTTP (MockMvc) — never call use cases or repositories directly
- Validate the full request → response flow: status code, response body shape
- For protected endpoints, test both the authenticated and unauthenticated paths
- Test naming follows the same functional convention as unit tests
- Keep IT tests focused on the HTTP contract, not business logic (that belongs in unit tests)
