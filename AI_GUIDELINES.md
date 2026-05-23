# Guía para IAs - Proyecto About Me

## 🎯 Visión General del Proyecto

**Objetivo**: Crear una página personal "Sobre mí" con múltiples características técnicas implementadas como ejercicio de aprendizaje.

**Stack Tecnológico**:
- **Backend**: Spring Boot 4.0.4 (Java 26)
- **Frontend**: React (a definir: Vite o CRA)
- **Build**: Gradle (backend), npm/yarn (frontend)
- **Contenedorización**: Docker + Docker Compose
- **Gestión de versiones**: Git (rama main/develop)

**Propósito**: Implementar de forma progresiva características como autenticación, cola de mensajería, envío de emails, etc., con el objetivo de aprender cómo se implementan en una aplicación real.

---

## 📁 Estructura del Proyecto

### Backend (Spring Boot)

```
src/
├── main/
│   ├── java/com/fbisquerra/aboutme/
│   │   ├── AboutmeApplication.java (entry point)
│   │   ├── config/           # Configuraciones de Spring
│   │   ├── controller/       # Controladores REST
│   │   ├── service/          # Lógica de negocio
│   │   ├── repository/       # Acceso a datos
│   │   ├── model/           # Entidades JPA
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── exception/       # Excepciones personalizadas
│   │   ├── security/        # Seguridad (JWT, etc.)
│   │   └── util/            # Utilidades
│   └── resources/
│       ├── application.yml  # Configuración principal
│       ├── application-dev.yml
│       └── application-prod.yml
└── test/
    └── java/com/fbisquerra/aboutme/
```

### Frontend (React)

```
frontend/
├── src/
│   ├── components/          # Componentes React reutilizables
│   ├── pages/              # Páginas/vistas principales
│   ├── services/           # Servicios API (axios/fetch)
│   ├── hooks/              # Custom hooks
│   ├── context/            # Context API para estado global
│   ├── styles/             # Estilos globales/compartidos
│   └── App.jsx
├── public/
├── package.json
└── vite.config.js o similar
```

### Docker

```
├── Dockerfile              # Para Spring Boot
├── Dockerfile.frontend     # Para React
├── docker-compose.yml      # Orquestación de servicios
└── .dockerignore
```

---

## 🏗️ Convenciones de Código

### Backend (Java/Spring)

**Nombres de clases**:
- Controllers: `{Feature}Controller` (ej: `AuthController`)
- Services: `{Feature}Service` o `I{Feature}Service` (interfaz)
- Repositories: `{Entity}Repository`
- Modelos: nombres en singular (ej: `User`, `Message`)
- DTOs: `{Entity}DTO` o `{Entity}Request`/`{Entity}Response`

**Convenciones de métodos**:
- Servicios: `save()`, `findById()`, `findAll()`, `delete()`, `update()`
- Controllers: `create()`, `getById()`, `getAll()`, `update()`, `delete()`

**Paquetes**:
- Usar estructura jerárquica clara: `com.fbisquerra.aboutme.{feature}.{layer}`
- Ejemplo: `com.fbisquerra.aboutme.auth.controller`

**Anotaciones comunes**:
```java
@RestController
@RequestMapping("/api/...")
@Service
@Repository
@Autowired
@GetMapping, @PostMapping, @PutMapping, @DeleteMapping
@Valid, @NotBlank, @Email
```

### Frontend (React)

**Componentes**:
- Usar PascalCase para nombres de componentes
- Preferir componentes funcionales con hooks
- Estructura de carpetas por feature/dominio cuando sea posible

**Servicios API**:
- Centralizar llamadas en `services/api.js` o carpeta `services/`
- Usar async/await

**Estilos**:
- Usar CSS Modules o Tailwind CSS (a definir)
- Evitar estilos inline en producción

---

## 🎬 Features Planificados (En Orden)

### 1️⃣ Fase 1: Estructura Base
- [ ] Crear estructura de carpetas en backend
- [ ] Configurar `application.yml` básico
- [ ] Crear controlador de prueba (ej: `PingController`)
- [ ] Generar proyecto React base
- [ ] Configurar Docker Compose

### 2️⃣ Fase 2: Autenticación de Usuario
- [ ] Crear modelo `User` en backend
- [ ] Configurar Spring Security + JWT
- [ ] Endpoint: POST `/api/auth/register` - Registrar usuario
- [ ] Endpoint: POST `/api/auth/login` - Iniciar sesión
- [ ] Endpoint: POST `/api/auth/logout` - Cerrar sesión
- [ ] Endpoint: GET `/api/auth/me` - Obtener usuario actual
- [ ] Implementar interceptor en frontend para enviar JWT
- [ ] Crear páginas de login/registro en React

### 3️⃣ Fase 3: Cola de Mensajería
- [ ] Agregar RabbitMQ o usar Spring Cloud Stream
- [ ] Crear servicio `MessageQueueService`
- [ ] Implementar productor de mensajes
- [ ] Implementar consumidor de mensajes
- [ ] Integrar en Docker Compose

### 4️⃣ Fase 4: Sistema de Email
- [ ] Configurar `JavaMailSender`
- [ ] Crear servicio `EmailService`
- [ ] Endpoint: POST `/api/email/send` - Enviar email
- [ ] Integrar con la cola de mensajes (envío asincrónico)
- [ ] Template de emails (Freemarker o Thymeleaf)

### 5️⃣ Fases Posteriores
- [ ] Perfil de usuario editables
- [ ] Subida de archivos/imágenes
- [ ] Comentarios/feedback
- [ ] Estadísticas de visitas
- [ ] Otros TBD

---

## ⚙️ Configuración Técnica Actual

**Spring Boot**:
- Versión: 4.0.4
- Java: 26
- Dependencias actuales:
  - `spring-boot-starter-web`
  - `spring-boot-starter-test`

**Build**:
- Gradle 8.x
- Compilación con: `./gradlew build`
- Ejecución: `./gradlew bootRun`
- Tests: `./gradlew test`

**Package**: `com.fbisquerra.aboutme`

---

## 🚀 Cómo Trabajar en el Proyecto

### Para Agregar una Nueva Feature

1. **Crear la estructura de carpetas** bajo `src/main/java/com/fbisquerra/aboutme/{feature}/`
2. **Crear modelo** en `model/` (ej: `User.java`)
3. **Crear repository** en `repository/` (extiende `JpaRepository`)
4. **Crear servicio** en `service/` con interfaz y implementación
5. **Crear controller** en `controller/` con endpoints REST
6. **Agregar DTOs** en `dto/` si es necesario
7. **Escribir tests** en `src/test/java/com/fbisquerra/aboutme/{feature}/`
8. **Actualizar dependencias** en `build.gradle` si se requiere

### Comandos Útiles

```bash
# Backend
./gradlew build              # Compilar
./gradlew bootRun            # Ejecutar
./gradlew test               # Tests
./gradlew clean              # Limpiar build

# Frontend (cuando exista)
npm install                  # Instalar dependencias
npm start                    # Desarrollo
npm run build                # Producción
npm test                     # Tests

# Docker
docker-compose up            # Iniciar servicios
docker-compose down          # Detener servicios
docker-compose logs -f       # Ver logs en tiempo real
```

---

## 🔍 Dónde Buscar Información

- **Configuración de Spring Boot**: `src/main/resources/application.yml`
- **Punto de entrada**: `src/main/java/com/fbisquerra/aboutme/AboutmeApplication.java`
- **Dependencias**: `build.gradle` (backend), `package.json` (frontend)
- **Documentación oficial**: 
  - Spring Boot: https://spring.io/projects/spring-boot
  - Spring Security: https://spring.io/projects/spring-security
  - React: https://react.dev

---

## 📝 Lineamientos para IAs

### ✅ SÍ

- Mantener consistencia con la estructura propuesta
- Crear archivos en las carpetas correctas siguiendo la convención
- Escribir documentación clara en código (comentarios y docstrings)
- Usar nombres descriptivos para variables, métodos y clases
- Hacer commits atómicos con mensajes claros
- Buscar documentación oficial antes de improvisar
- Consultar la estructura existente antes de agregar cosas nuevas
- Crear tests para código crítico
- Usar DTOs para exponer datos en APIs REST

### ❌ NO

- No mezclar lógica de negocio en controladores
- No usar nombres genéricos como `data`, `result`, `temp`
- No ignorar convenciones existentes "porque funciona"
- No crear nuevas carpetas sin documentar su propósito
- No commitear sin verificar que compila y los tests pasan
- No hacer cambios de architectura sin consenso
- No dejar código comentado o muerto
- No hardcodear valores; usar `application.yml`

---

## 🎯 Próximos Pasos

1. Revisar este documento completo
2. Esperar instrucciones específicas del usuario
3. Implementar features en orden según el plan
4. Actualizar este documento cuando surjan nuevas convenciones

---

**Última actualización**: Inicio del proyecto  
**Versión**: 1.0  
**Estado**: Activo
