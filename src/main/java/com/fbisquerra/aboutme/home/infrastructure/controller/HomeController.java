package com.fbisquerra.aboutme.home.infrastructure.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para el módulo Home.
 *
 * Endpoints:
 * - GET /api/home/greeting → Devuelve un saludo simple del backend
 */
@RestController
@RequestMapping("/api/home")
public class HomeController {

    /**
     * Endpoint simple que devuelve un saludo.
     *
     * @return JSON con mensaje "Hello world!"
     *
     * Ejemplo de respuesta:
     * {
     *   "message": "Hello world!"
     * }
     */
    @GetMapping("/greeting")
    public ResponseEntity<GreetingResponse> getGreeting() {
        return ResponseEntity.ok(new GreetingResponse("Hello world!"));
    }

    /**
     * DTO simple para la respuesta del greeting.
     * Nota: En una aplicación real, esto estaría en application/dto/
     * Por ahora lo dejamos aquí por simplicidad.
     */
    public record GreetingResponse(String message) {}
}
