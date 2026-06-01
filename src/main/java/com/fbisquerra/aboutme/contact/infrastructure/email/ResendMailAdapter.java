package com.fbisquerra.aboutme.contact.infrastructure.email;

import com.fbisquerra.aboutme.contact.domain.model.ContactMessage;
import com.fbisquerra.aboutme.contact.domain.port.ContactEmailPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class ResendMailAdapter implements ContactEmailPort {

    private final JavaMailSender mailSender;
    private final String recipientEmail;
    private final String fromEmail;

    public ResendMailAdapter(JavaMailSender mailSender, @Value("${app.contact.recipient-email}") String recipientEmail, @Value("${app.contact.from-email}") String fromEmail
    ) {
        this.mailSender = mailSender;
        this.recipientEmail = recipientEmail;
        this.fromEmail = fromEmail;
    }

    @Override
    public void send(ContactMessage message) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(fromEmail);
        mail.setTo(recipientEmail);
        mail.setReplyTo(message.senderEmail());
        mail.setSubject("[Contact] Mensaje de " + message.name());
        mail.setText(
                "Nombre: " + message.name() + "\n" +
                "Email: " + message.senderEmail() + "\n\n" +
                message.message()
        );
        mailSender.send(mail);
    }
}
