package com.fbisquerra.aboutme.contact.fixtures;

import com.fbisquerra.aboutme.contact.application.dto.ContactRequest;
import com.fbisquerra.aboutme.contact.domain.model.ContactMessage;

public class ContactFixture {

    public static ContactRequest validRequest() {
        return new ContactRequest("John Doe", "john@example.com", "Hello, I'd like to get in touch!");
    }

    public static ContactMessage validMessage() {
        return new ContactMessage("John Doe", "john@example.com", "Hello, I'd like to get in touch!");
    }
}
