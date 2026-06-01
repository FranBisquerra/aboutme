package com.fbisquerra.aboutme.contact.application.usecase;

import com.fbisquerra.aboutme.contact.domain.model.ContactMessage;
import com.fbisquerra.aboutme.contact.domain.port.ContactEmailPort;
import com.fbisquerra.aboutme.contact.fixtures.ContactFixture;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SendContactMessageUseCaseTest {

    @Mock
    private ContactEmailPort contactEmailPort;

    @InjectMocks
    private SendContactMessageUseCase sendContactMessageUseCase;

    @Test
    void shouldDelegateToEmailPort() {
        sendContactMessageUseCase.execute(ContactFixture.validRequest());

        verify(contactEmailPort).send(org.mockito.ArgumentMatchers.any(ContactMessage.class));
    }

    @Test
    void shouldPassCorrectDataToEmailPort() {
        sendContactMessageUseCase.execute(ContactFixture.validRequest());

        ArgumentCaptor<ContactMessage> captor = ArgumentCaptor.forClass(ContactMessage.class);
        verify(contactEmailPort).send(captor.capture());

        ContactMessage sent = captor.getValue();
        assertThat(sent.name(), is("John Doe"));
        assertThat(sent.senderEmail(), is("john@example.com"));
        assertThat(sent.message(), is("Hello, I'd like to get in touch!"));
    }
}
