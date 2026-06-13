package com.fbisquerra.aboutme.contact.infrastructure.controller;

import com.fbisquerra.aboutme.contact.application.dto.ContactRequest;
import com.fbisquerra.aboutme.contact.application.usecase.SendContactMessageUseCase;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final SendContactMessageUseCase sendContactMessageUseCase;

    public ContactController(SendContactMessageUseCase sendContactMessageUseCase) {
        this.sendContactMessageUseCase = sendContactMessageUseCase;
    }

    @PostMapping
    public ResponseEntity<Void> sendMessage(@Valid @RequestBody ContactRequest request) {
        sendContactMessageUseCase.execute(request);
        return ResponseEntity.noContent().build();
    }
}
