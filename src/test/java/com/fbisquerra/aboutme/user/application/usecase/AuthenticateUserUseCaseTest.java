package com.fbisquerra.aboutme.user.application.usecase;

import com.fbisquerra.aboutme.user.application.dto.LoginResponse;
import com.fbisquerra.aboutme.user.domain.exception.InvalidCredentialsException;
import com.fbisquerra.aboutme.user.domain.model.User;
import com.fbisquerra.aboutme.user.domain.port.AccessTokenIssuer;
import com.fbisquerra.aboutme.user.domain.port.PasswordHasher;
import com.fbisquerra.aboutme.user.domain.repository.UserRepository;
import com.fbisquerra.aboutme.user.fixtures.UserFixture;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticateUserUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordHasher passwordHasher;

    @Mock
    private AccessTokenIssuer accessTokenIssuer;

    @InjectMocks
    private AuthenticateUserUseCase authenticateUserUseCase;

    @Test
    void shouldIssueTokenWhenCredentialsAreValid() {
        User admin = UserFixture.adminUser();
        when(userRepository.findByUsername(UserFixture.USERNAME)).thenReturn(Optional.of(admin));
        when(passwordHasher.matches(UserFixture.RAW_PASSWORD, admin.passwordHash())).thenReturn(true);
        when(accessTokenIssuer.issue(admin)).thenReturn(new AccessTokenIssuer.IssuedToken("a.jwt.token", 3600));

        LoginResponse response = authenticateUserUseCase.execute(UserFixture.validLogin());

        assertThat(response.token(), is("a.jwt.token"));
        assertThat(response.tokenType(), is("Bearer"));
        assertThat(response.expiresIn(), is(3600L));
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        when(userRepository.findByUsername(UserFixture.USERNAME)).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class,
                () -> authenticateUserUseCase.execute(UserFixture.validLogin()));

        verify(accessTokenIssuer, never()).issue(any());
    }

    @Test
    void shouldThrowWhenPasswordDoesNotMatch() {
        User admin = UserFixture.adminUser();
        when(userRepository.findByUsername(UserFixture.USERNAME)).thenReturn(Optional.of(admin));
        when(passwordHasher.matches(UserFixture.RAW_PASSWORD, admin.passwordHash())).thenReturn(false);

        assertThrows(InvalidCredentialsException.class,
                () -> authenticateUserUseCase.execute(UserFixture.validLogin()));

        verify(accessTokenIssuer, never()).issue(any());
    }
}
