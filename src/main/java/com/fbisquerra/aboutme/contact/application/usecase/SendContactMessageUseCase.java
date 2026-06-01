package com.fbisquerra.aboutme.contact.application.usecase;

import com.fbisquerra.aboutme.contact.application.dto.ContactRequest;
import com.fbisquerra.aboutme.contact.domain.model.ContactMessage;
import com.fbisquerra.aboutme.contact.domain.port.ContactEmailPort;
import org.springframework.stereotype.Component;

@Component
public class SendContactMessageUseCase {

    private final ContactEmailPort contactEmailPort;

    public SendContactMessageUseCase(ContactEmailPort contactEmailPort) {
        this.contactEmailPort = contactEmailPort;
    }

    public void execute(ContactRequest request) {
        ContactMessage message = new ContactMessage(request.name(), request.email(), request.message());
        contactEmailPort.send(message);
    }
}
