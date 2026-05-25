# /it-test — Write a Backend Integration Test

Guide for writing integration tests (full HTTP request → response) using MockMvc.

## Key Spring Boot 4 constraint

`@AutoConfigureMockMvc` does not exist in Spring Boot 4. MockMvc must be set up manually:

```java
@SpringBootTest
class ProfileControllerIT {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }
}
```

## Test structure

```
src/test/java/com/fbisquerra/aboutme/
└── {module}/
    └── infrastructure/
        └── controller/
            └── {Aggregate}ControllerIT.java
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

## Rules

- Use `@SpringBootTest` — loads the full Spring context
- Always go through HTTP (MockMvc) — never call use cases or repositories directly
- Validate the full request → response flow: status code, response body shape
- Test naming follows the same functional convention as unit tests
- Use `MockMvcResultMatchers` (status, jsonPath, content)
- Keep IT tests focused on the HTTP contract, not business logic (that belongs in unit tests)
