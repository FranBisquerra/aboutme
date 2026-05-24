# Guía para IAs - Proyecto About Me

## 🎯 Visión General del Proyecto

**Objetivo**: Crear una página personal "Sobre mí" con múltiples características técnicas implementadas como ejercicio de aprendizaje.

**Stack Tecnológico**:
- **Backend**: Spring Boot 4.0.4 (Java 26) con Arquitectura Hexagonal + DDD
- **Frontend**: Vue 3.5.34 + Vite 5 + Tailwind CSS 4 + Axios
- **Build**: Gradle (backend + tareas Docker), npm (frontend)
- **Contenedorización**: Docker + Docker Compose (local y producción)
- **SSL/TLS**: Let's Encrypt (Certbot, renovación automática)
- **Gestión de versiones**: Git (rama main/develop)

**Propósito**: Implementar de forma progresiva características como autenticación, cola de mensajería, envío de emails, etc., con el objetivo de aprender cómo se implementan en una aplicación real.

---

## 📁 Estructura del Proyecto - Frontend (Vue 3)

```
frontend/
├── src/
│   ├── App.vue                    # Componente raíz
│   ├── main.js                    # Punto de entrada
│   ├── index.css                  # Estilos globales + Tailwind
│   ├── api/                       # Clientes HTTP (Axios)
│   ├── data/                      # Datos estáticos (JSON)
│   └── components/                # Componentes de la UI
├── index.html
├── vite.config.js
└── package.json
```

**Convenciones frontend**:
- Componentes en PascalCase con extensión `.vue`
- Estilos con clases de Tailwind CSS (sin CSS custom salvo `index.css`)
- Llamadas HTTP centralizadas en `api/`
- Datos estáticos del perfil en `data/` (sin API)

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

## 🚀 Filosofía de Desarrollo

### Iteración e Incrementalidad

- **Versiones pequeñas y funcionales**: Mejor tener un feature simple que funciona que muchas características a medias
- **Agregar dependencias bajo demanda**: Solo cuando realmente se necesitan, no "por si acaso"
- **Refactorizar gradualmente**: Mejorar el diseño conforme crecen los requisitos
- **Validar frecuentemente**: Compilar y testear regularmente para detectar problemas temprano
- **Integración continua**: Los cambios se integran frecuentemente en `develop`

### Principio YAGNI (You Aren't Gonna Need It)

- ✅ Implementar solo lo que se necesita ahora
- ✅ Diseñar para extensibilidad pero no sobre-ingenierizar
- ✅ Agregar features cuando sean realmente solicitadas
- ❌ No agregar código "por si acaso"
- ❌ No usar patrones complejos si una solución simple funciona

### Gestión de Dependencias

- ✅ Agregar dependencias cuando se necesitan para una feature específica
- ✅ Documentar por qué se agrega cada dependencia
- ✅ Usar versiones estables y bien mantenidas
- ✅ Revisar licencias y compatibilidad
- ❌ No agregar librerías por "seguir tendencias"
- ❌ No duplicar funcionalidad que ya existe en las dependencias actuales

---

## 🚀 Despliegue con Gradle + Docker

### Tareas Gradle disponibles

| Tarea | Comando | Descripción |
|-------|---------|-------------|
| `installFrontend` | (interna) | Ejecuta `npm install` en `frontend/` |
| `buildFrontend` | (interna) | Ejecuta `npm run build` (produce `frontend/dist/`) |
| `dockerRun` | `./gradlew dockerRun` | Perfil `local`: construye y levanta 2 contenedores |
| `dockerRun (pro)` | `./gradlew dockerRun -Pprofile=pro` | Perfil `pro`: 3 contenedores con SSL |
| `dockerStop` | `./gradlew dockerStop` | Para los contenedores activos |
| `dockerStart` | `./gradlew dockerStart` | Reanuda contenedores ya creados |

El task `build` depende de `buildFrontend`, por lo que compilar el backend ya incluye compilar el frontend.

### Perfiles de entorno

| Perfil | Compose file | Contenedores | Acceso |
|--------|-------------|--------------|--------|
| `dev` | — | ninguno (procesos locales) | backend `:8080`, frontend `:5173` |
| `local` | `docker-compose.yml` | `frontend`, `backend` | `http://localhost` |
| `pro` | `docker-compose.prod.yml` | `frontend`, `backend`, `certbot` | `https://<DOMAIN>` |

### Detalles del perfil `pro`

- Nginx escucha en puerto 80 (redirige a HTTPS) y 443 (SSL/TLS)
- Certbot gestiona certificados Let's Encrypt con renovación automática cada 12h
- Requiere variable `DOMAIN` en `.env` (actualmente `franbisquerra.dev`)
- El backend tiene política `restart: always` en producción

---

## 🚫 RESTRICCIONES Y LINEAMIENTOS PARA IAs

### ⚠️ Restricciones Críticas

**GIT - COMMITS**:
- **🔴 NO COMITEAR NADA SIN ORDEN EXPLÍCITA DEL USUARIO**
- Antes de cualquier acción, informar al usuario del plan
- Verificar siempre con `git status` antes de considerar cambios
- Cuando se autorice, hacer commits atómicos con mensajes claros
- Nunca hacer force-push
- Nunca modificar historial de commits existentes

**TESTS**:
- **🔴 NO EJECUTAR `./gradlew test` A MENOS QUE SE INDIQUE EXPLÍCITAMENTE**
- ✅ Sí compilar con `./gradlew build` para verificar errores de compilación
- Si hay fallos de compilación, reportar al usuario EN VEZ DE commitear
- Solo ejecutar tests cuando el usuario explícitamente lo pida

**CAMBIOS DE CÓDIGO**:
- Antes de hacer cambios significativos, **informar al usuario del plan completo**
- Esperar **confirmación explícita** antes de proceder
- Si hay dudas sobre diseño o arquitectura, **preguntar primero**
- No asumir preferencias del usuario

### ✅ Buenas Prácticas

- Mantener consistencia con la estructura propuesta
- Crear archivos en las carpetas correctas siguiendo la convención
- Escribir documentación clara en código (comentarios y docstrings)
- Usar nombres descriptivos para variables, métodos y clases
- Buscar documentación oficial antes de improvisar
- Consultar la estructura existente antes de agregar cosas nuevas
- Separar clara y estrictamente: **Dominio** (sin Spring), **Aplicación** (orquestación), **Infraestructura** (adaptadores)
- Usar DTOs para exponer datos en APIs REST
- Hacer Value Objects inmutables y validar en el constructor

### ❌ Evitar

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

**Backend (Spring Boot)**:
- Versión: 4.0.4
- Java: 26
- Dependencias actuales:
  - `spring-boot-starter-web`
- Dependencias pendientes (a añadir cuando se necesiten):
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-validation`
  - `spring-boot-starter-security`
  - Database driver (PostgreSQL o H2)

**Build**: Gradle 8.x

**Package**: `com.fbisquerra.aboutme`

**Frontend (Vue 3)**:
- Vue: 3.5.34
- Vite: 5.4.11
- Tailwind CSS: 4.3.0 (via plugin `@tailwindcss/vite`)
- Axios: 1.7.9

---

## 🔍 Dónde Buscar Información

- **Documentación DDD**: Eric Evans - Domain Driven Design
- **Hexagonal Architecture**: Alistair Cockburn
- **Spring Boot**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **Configuración**: `src/main/resources/application.yml`

---

**Última actualización**: Migración a Vue 3 + herramientas de despliegue (2026-05-24)  
**Versión**: 4.0  
**Estado**: En desarrollo activo
