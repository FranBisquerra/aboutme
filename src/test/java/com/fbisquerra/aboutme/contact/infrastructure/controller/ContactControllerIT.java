package com.fbisquerra.aboutme.contact.infrastructure.controller;

import com.fbisquerra.aboutme.AbstractIntegrationTest;
import com.fbisquerra.aboutme.contact.domain.model.ContactMessage;
import com.fbisquerra.aboutme.contact.domain.port.ContactEmailPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "RESEND_API_KEY=test-key")
class ContactControllerIT extends AbstractIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @MockitoBean
    private ContactEmailPort contactEmailPort;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void shouldReturn204OnValidRequest() throws Exception {
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "name": "John Doe",
                      "email": "john@example.com",
                      "message": "Hello!"
                    }
                    """))
            .andExpect(status().isNoContent());
    }

    @Test
    void shouldForwardCorrectDataToEmailPort() throws Exception {
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "name": "John Doe",
                      "email": "john@example.com",
                      "message": "Hello!"
                    }
                    """))
            .andExpect(status().isNoContent());

        ArgumentCaptor<ContactMessage> captor = ArgumentCaptor.forClass(ContactMessage.class);
        verify(contactEmailPort).send(captor.capture());

        assertThat(captor.getValue().name(), is("John Doe"));
        assertThat(captor.getValue().senderEmail(), is("john@example.com"));
        assertThat(captor.getValue().message(), is("Hello!"));
    }
}
