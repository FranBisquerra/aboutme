package com.fbisquerra.aboutme.shared.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS config for dev only: allows the Vite dev server (localhost:5173) to call
 * the backend (localhost:8080). In production, Nginx proxies both under the same
 * origin so this is not needed.
 */
@Profile("dev")
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                .addMapping("/api/**")                           // Permitir CORS en todos los endpoints /api/**
                .allowedOrigins("http://localhost:5173")        // Origen permitido: Vite dev server
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Métodos HTTP permitidos
                .allowedHeaders("*")                            // Headers permitidos
                .allowCredentials(true)                         // Permitir cookies/credenciales
                .maxAge(3600);                                  // Cache del preflight por 1 hora
    }
}
