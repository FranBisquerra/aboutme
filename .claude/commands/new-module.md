# /new-module — Create a New DDD Module

Checklist for adding a new bounded context module to the backend following Hexagonal Architecture + DDD.

## Folder structure to create

```
src/main/java/com/fbisquerra/aboutme/{module}/
├── domain/
│   ├── model/
│   │   ├── {Aggregate}.java          ← root aggregate (no Spring annotations)
│   │   ├── {AggregateId}.java        ← ID as a Value Object
│   │   └── {OtherVO}.java            ← other Value Objects if needed
│   ├── repository/
│   │   └── {Aggregate}Repository.java  ← PORT: interface only, no JPA
│   ├── service/                      ← only if there's cross-aggregate logic
│   │   └── {Feature}DomainService.java
│   └── event/                        ← only if domain events are needed
│       └── {Event}Event.java
├── application/
│   ├── usecase/
│   │   └── {Action}UseCase.java      ← one class per use case
│   ├── dto/
│   │   ├── {Aggregate}Request.java
│   │   └── {Aggregate}Response.java
│   └── mapper/
│       └── {Aggregate}Mapper.java
└── infrastructure/
    ├── controller/
    │   └── {Aggregate}Controller.java  ← REST adapter
    └── persistence/
        ├── {Aggregate}JpaEntity.java
        ├── {Aggregate}JpaRepository.java  ← Spring Data interface
        └── {Aggregate}RepositoryImpl.java ← implements domain PORT
```

## Checklist

- [ ] Domain model created with no Spring imports
- [ ] Value Objects are immutable; validation in constructor
- [ ] Repository interface is in `domain/repository/` (no JPA)
- [ ] Use case(s) created in `application/usecase/` — one class per action
- [ ] DTOs in `application/dto/` — never expose domain objects directly via REST
- [ ] Mapper converts between domain ↔ DTO
- [ ] Controller uses DTOs only, delegates to use case
- [ ] JPA entity is separate from domain model
- [ ] RepositoryImpl wires Spring Data to the domain port
- [ ] Unit tests added for domain model and use cases
- [ ] Integration test added for the controller

## Hard rules

- **Domain layer**: zero Spring annotations (`@Component`, `@Service`, `@Repository`, etc.)
- **Application layer**: orchestration only — no business logic
- **Infrastructure layer**: the only place allowed to touch JPA, HTTP, or external systems
- Never use JPA entities in business logic — map to domain model first
- Never hardcode values — use `application.yml`
