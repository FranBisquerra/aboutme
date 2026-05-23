package com.fbisquerra.aboutme.shared.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración CORS (Cross-Origin Resource Sharing) para permitir
 * que el frontend en Vite (puerto 5173) pueda hacer requests al backend (puerto 8080).
 *
 * En desarrollo:
 * - Frontend corre en: http://localhost:5173
 * - Backend corre en: http://localhost:8080
 *
 * Sin esta configuración, el navegador bloquearía los requests por SOP (Same-Origin Policy).
 */
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
