package com.fbisquerra.aboutme.contact.domain.model;

public record ContactMessage(String name, String senderEmail, String message) {

    public ContactMessage {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Name is required");
        if (senderEmail == null || senderEmail.isBlank()) throw new IllegalArgumentException("Email is required");
        if (message == null || message.isBlank()) throw new IllegalArgumentException("Message is required");
    }
}
