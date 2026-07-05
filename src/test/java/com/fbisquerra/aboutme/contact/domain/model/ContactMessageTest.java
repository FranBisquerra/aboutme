package com.fbisquerra.aboutme.contact.domain.model;

import org.junit.jupiter.api.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ContactMessageTest {

    @Test
    void shouldCreateValidContactMessage() {
        ContactMessage message = new ContactMessage("John", "john@example.com", "Hello!");

        assertThat(message.name(), is("John"));
        assertThat(message.senderEmail(), is("john@example.com"));
        assertThat(message.message(), is("Hello!"));
    }

    @Test
    void shouldRejectBlankName() {
        assertThrows(IllegalArgumentException.class,
            () -> new ContactMessage("", "john@example.com", "Hello!"));
    }

    @Test
    void shouldRejectNullName() {
        assertThrows(IllegalArgumentException.class,
            () -> new ContactMessage(null, "john@example.com", "Hello!"));
    }

    @Test
    void shouldRejectBlankEmail() {
        assertThrows(IllegalArgumentException.class,
            () -> new ContactMessage("John", "", "Hello!"));
    }

    @Test
    void shouldRejectBlankMessage() {
        assertThrows(IllegalArgumentException.class,
            () -> new ContactMessage("John", "john@example.com", "  "));
    }
}
