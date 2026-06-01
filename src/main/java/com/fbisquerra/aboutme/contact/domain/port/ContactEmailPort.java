package com.fbisquerra.aboutme.contact.domain.port;

import com.fbisquerra.aboutme.contact.domain.model.ContactMessage;

public interface ContactEmailPort {
    void send(ContactMessage message);
}
