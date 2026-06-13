package com.fbisquerra.aboutme.user.application.usecase;

import com.fbisquerra.aboutme.user.application.dto.LoginRequest;
import com.fbisquerra.aboutme.user.application.dto.LoginResponse;
import com.fbisquerra.aboutme.user.domain.exception.InvalidCredentialsException;
import com.fbisquerra.aboutme.user.domain.model.User;
import com.fbisquerra.aboutme.user.domain.port.AccessTokenIssuer;
import com.fbisquerra.aboutme.user.domain.port.PasswordHasher;
import com.fbisquerra.aboutme.user.domain.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class AuthenticateUserUseCase {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final AccessTokenIssuer accessTokenIssuer;

    public AuthenticateUserUseCase(UserRepository userRepository,
                                   PasswordHasher passwordHasher,
                                   AccessTokenIssuer accessTokenIssuer) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.accessTokenIssuer = accessTokenIssuer;
    }

    public LoginResponse execute(LoginRequest request) {
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordHasher.matches(request.password(), user.passwordHash())) {
            throw new InvalidCredentialsException();
        }

        var issued = accessTokenIssuer.issue(user);
        return new LoginResponse(issued.token(), "Bearer", issued.expiresInSeconds());
    }
}
