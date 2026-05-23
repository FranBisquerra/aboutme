# Guía para IAs - Proyecto About Me

## 🎯 Visión General del Proyecto

**Objetivo**: Crear una página personal "Sobre mí" con múltiples características técnicas implementadas como ejercicio de aprendizaje.

**Stack Tecnológico**:
- **Backend**: Spring Boot 4.0.4 (Java 26) con Arquitectura Hexagonal + DDD
- **Frontend**: React (a definir: Vite o CRA)
- **Build**: Gradle (backend), npm/yarn (frontend)
- **Contenedorización**: Docker + Docker Compose
- **Gestión de versiones**: Git (rama main/develop)

**Propósito**: Implementar de forma progresiva características como autenticación, cola de mensajería, envío de emails, etc., con el objetivo de aprender cómo se implementan en una aplicación real.

---

## 📁 Estructura del Proyecto - Backend (Hexagonal + DDD)

### Arquitectura Hexagonal (Puertos y Adaptadores)

La aplicación se organiza en **módulos por agregado**, cada uno con tres capas:

```
src/main/java/com/fbisquerra/aboutme/
│
├── shared/                              # Código compartido entre módulos
│   ├── domain/
│   │   ├── DomainEvent.java           # Clase base para eventos
│   │   ├── DomainException.java       # Excepción base de dominio
│   │   └── ValueObject.java           # Interfaz/clase base para VOs
│   └── infrastructure/
│       └── config/                     # Configuración compartida
│
├── {modulo}/                           # Módulo (Agregado raíz)
│   │
│   ├── domain/                         # CAPA DE DOMINIO
│   │   ├── model/                      # Agregados, Entidades, Value Objects
│   │   │   ├── {Agregado}.java
│   │   │   ├── {AgregadoId}.java      # Value Object de ID
│   │   │   └── {OtroVO}.java
│   │   ├── repository/                 # PUERTO: Interfaz de persistencia
│   │   │   └── {Agregado}Repository.java
│   │   ├── service/                    # Servicios de Dominio (lógica pura)
│   │   │   └── {Feature}DomainService.java
│   │   └── event/                      # Eventos de Dominio
│   │       └── {Evento}Event.java
│   │
│   ├── application/                    # CAPA DE APLICACIÓN
│   │   ├── usecase/                    # Casos de Uso (orquestación)
│   │   │   └── {Accion}UseCase.java
│   │   ├── dto/                        # Data Transfer Objects
│   │   │   ├── {Agregado}Request.java
│   │   │   └── {Agregado}Response.java
│   │   ├── mapper/                     # Mapeo Domain ↔ DTO
│   │   │   └── {Agregado}Mapper.java
│   │   └── command/                    # CQRS: Comandos
│   │       └── {Comando}Command.java
│   │
│   └── infrastructure/                 # CAPA DE INFRAESTRUCTURA
│       ├── controller/                 # ADAPTADOR: API REST
│       │   └── {Agregado}Controller.java
│       ├── persistence/                # ADAPTADOR: Acceso a Datos
│       │   ├── {Agregado}JpaEntity.java
│       │   ├── {Agregado}JpaRepository.java (Spring Data)
│       │   └── {Agregado}RepositoryImpl.java (Implementación del puerto)
│       ├── event/                      # ADAPTADOR: Publicación de eventos
│       │   └── {Agregado}EventPublisher.java
│       └── config/                     # Configuración del módulo
│           └── {Agregado}Config.java
│
└── resources/
    ├── application.yml                 # Configuración principal
    ├── application-dev.yml
    └── application-prod.yml
```

---

## 🏗️ Conceptos Clave - DDD

| Concepto | Descripción | Ubicación |
|----------|-------------|-----------|
| **Agregado** | Raíz de un Bounded Context con ciclo de vida completo | `domain/model/{Agregado}.java` |
| **Value Object** | Objeto inmutable sin identidad propia | `domain/model/{VO}.java` |
| **Entity** | Objeto con identidad única (dentro del agregado) | `domain/model/` |
| **Repositorio (Puerto)** | Interfaz abstracta, sin detalles de persistencia | `domain/repository/` |
| **Repositorio (Adaptador)** | Implementación concreta con JPA | `infrastructure/persistence/` |
| **Domain Service** | Lógica de negocio pura (sin Spring) | `domain/service/` |
| **Application Service / UseCase** | Orquestación de acciones, transacciones | `application/usecase/` |
| **Evento de Dominio** | Suceso importante del negocio | `domain/event/` |
| **DTO** | Objeto para transferir datos entre capas | `application/dto/` |
| **Mapper** | Convertir entre entidades de dominio y DTOs | `application/mapper/` |

---

## 🚫 RESTRICCIONES CRÍTICAS PARA IAs

### ⚠️ GIT - COMMITS

- **🔴 NO COMITEAR NADA SIN ORDEN EXPLÍCITA DEL USUARIO**
- Antes de cualquier acción, informar al usuario del plan
- Verificar siempre con `git status` antes de considerar cambios
- Cuando se autorice, hacer commits atómicos con mensajes claros
- Nunca hacer force-push
- Nunca modificar historial de commits existentes

### ⚠️ TESTS

- **🔴 NO EJECUTAR `./gradlew test` A MENOS QUE SE INDIQUE EXPLÍCITAMENTE**
- ✅ Sí compilar con `./gradlew build` para verificar errores de compilación
- Si hay fallos de compilación, reportar al usuario EN VEZ DE commitear
- Solo ejecutar tests cuando el usuario explícitamente lo pida

### ⚠️ CAMBIOS DE CÓDIGO

- Antes de hacer cambios significativos, **informar al usuario del plan completo**
- Esperar **confirmación explícita** antes de proceder
- Si hay dudas sobre diseño o arquitectura, **preguntar primero**
- No asumir preferencias del usuario

---

## ✅ SÍ

- Mantener consistencia con la estructura propuesta
- Crear archivos en las carpetas correctas siguiendo la convención
- Escribir documentación clara en código (comentarios y docstrings)
- Usar nombres descriptivos para variables, métodos y clases
- Buscar documentación oficial antes de improvisar
- Consultar la estructura existente antes de agregar cosas nuevas
- Separar clara y estrictamente: **Dominio** (sin Spring), **Aplicación** (orquestación), **Infraestructura** (adaptadores)
- Usar DTOs para exponer datos en APIs REST
- Hacer Value Objects inmutables y validar en el constructor

## ❌ NO

- No comitear sin orden explícita
- No ejecutar tests sin orden explícita
- No mezclar lógica de negocio en controladores
- No importar Spring en la capa de dominio (domain/ no debe tener @annotations)
- No usar entidades JPA directamente en la lógica de negocio
- No dejar código comentado o muerto
- No hardcodear valores; usar `application.yml`
- No crear nuevas capas/módulos sin documentar su propósito
- No ignorar la separación de responsabilidades

---

## 🧪 Testing Unitario

### Estructura de Tests

```
src/test/java/com/fbisquerra/aboutme/
│
└── {modulo}/
    ├── domain/                         # Tests de lógica de dominio (sin Spring)
    │   ├── model/
    │   │   └── {Agregado}Test.java
    │   ├── service/
    │   │   └── {Feature}DomainServiceTest.java
    │   └── value/
    │       └── {VO}Test.java
    │
    ├── application/                    # Tests de casos de uso
    │   └── usecase/
    │       └── {Accion}UseCaseTest.java
    │
    └── fixtures/                       # Datos de prueba reutilizables
        └── {Entidad}Fixture.java
```

### Frameworks y Librerías

- **Testing**: JUnit 5 (Jupiter)
- **Mocking**: Mockito
- **Assertions**: Hamcrest
- **HTTP Testing**: MockMvc
- **Fixtures**: Factory Methods Pattern

### Principios de Testing

**Objetivo**: Asegurar consistencia, fiabilidad en CI/CD y mantenibilidad del código.

**Domain Layer Tests**:
- ✅ Tests unitarios puros (sin @SpringBootTest)
- ✅ Validar lógica de negocio y reglas de dominio
- ✅ Testear Value Objects y sus validaciones
- ✅ Testear comportamiento del Agregado
- ✅ No mockear dependencias internas del dominio
- ❌ No usar anotaciones de Spring

**Application Layer Tests**:
- ✅ Usar @ExtendWith(MockitoExtension.class)
- ✅ Mockear repositorios y servicios de dominio
- ✅ Testear orquestación de casos de uso
- ✅ Validar mapeo de DTOs
- ❌ No cargar contexto de Spring

**Integration Tests** (con MockMvc):
- ✅ Usar @SpringBootTest para cargar contexto
- ✅ Usar MockMvc para testear controladores
- ✅ Validar flujo completo request → response
- ✅ Tests nombrados funcionalmente
- ❌ No testear sin MockMvc

### Estructura de Tests: Arrange-Act-Assert

Todos los tests siguen el patrón AAA:

```
1. ARRANGE   → Preparar datos de prueba (fixtures)
2. ACT       → Ejecutar la acción a testear
3. ASSERT    → Validar resultados con Hamcrest
```

### Nomenclatura de Tests

**Nombres funcionales de alto nivel** (no técnicos):

```
shouldSuccessfullyRegisterUserWithValidEmail()
shouldThrowExceptionWhenEmailAlreadyExists()
shouldValidatePasswordComplexity()
shouldAuthenticateUserWithCorrectCredentials()
shouldReturnUnauthorizedWhenPasswordIsWrong()
shouldReturnHttpCreatedStatusOnSuccessfulRegistration()
```

**Ubicación de fixtures**:
```
{Entidad}Fixture.java      # Factory Methods para crear datos de prueba
```

### Convenciones de Testing

- ✅ Un test por comportamiento esperado
- ✅ Tests independientes (sin orden de ejecución)
- ✅ Setup de datos mediante fixtures (Factory Methods)
- ✅ Usar Hamcrest matchers para assertions legibles
- ✅ Escribir tests como buena práctica (TDD recomendado)
- ✅ Mantener tests simples y enfocados
- ❌ No testear getters/setters triviales
- ❌ No hardcodear valores mágicos (usar fixtures)
- ❌ No usar `Thread.sleep()` en tests
- ❌ No compartir estado entre tests

### Fixtures: Factory Methods

Los fixtures proporcionan datos consistentes para tests mediante Factory Methods:

```
UserFixture.java
├── validUser()                    # Usuario válido con datos estándar
├── userWithoutEmail()             # Usuario sin email
├── adminUser()                    # Usuario con rol admin
└── customUser(...)                # Factory method personalizado
```

Ventajas:
- ✅ Reutilización de datos de prueba
- ✅ Fácil mantenimiento centralizado
- ✅ Nombres descriptivos
- ✅ Flexibilidad para crear variantes

### Assertions con Hamcrest

Usar matchers legibles y expresivos para validaciones.

---

## ⚙️ Configuración Técnica Actual

**Spring Boot**:
- Versión: 4.0.4
- Java: 26
- Dependencias necesarias (a definir):
  - spring-boot-starter-web
  - spring-boot-starter-data-jpa
  - spring-boot-starter-validation
  - spring-boot-starter-security (cuando corresponda)
  - Database driver (PostgreSQL o H2)

**Build**: Gradle 8.x

**Package**: `com.fbisquerra.aboutme`

---

## 🔍 Dónde Buscar Información

- **Documentación DDD**: Eric Evans - Domain Driven Design
- **Hexagonal Architecture**: Alistair Cockburn
- **Spring Boot**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **Configuración**: `src/main/resources/application.yml`

---

**Última actualización**: Planificación de arquitectura  
**Versión**: 2.0  
**Estado**: Especificación lista para implementación
