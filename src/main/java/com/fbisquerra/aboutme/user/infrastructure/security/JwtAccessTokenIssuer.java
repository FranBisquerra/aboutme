package com.fbisquerra.aboutme.user.infrastructure.security;

import com.fbisquerra.aboutme.user.domain.model.User;
import com.fbisquerra.aboutme.user.domain.port.AccessTokenIssuer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class JwtAccessTokenIssuer implements AccessTokenIssuer {

    private final JwtEncoder jwtEncoder;
    private final long expirationSeconds;

    public JwtAccessTokenIssuer(JwtEncoder jwtEncoder, @Value("${app.security.jwt.expiration}") long expirationSeconds) {
        this.jwtEncoder = jwtEncoder;
        this.expirationSeconds = expirationSeconds;
    }

    @Override
    public IssuedToken issue(User user) {
        var now = Instant.now();
        var claims = JwtClaimsSet.builder()
                .subject(user.username())
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expirationSeconds))
                .claim("role", user.role().name())
                .build();

        var header = JwsHeader.with(MacAlgorithm.HS256).build();
        var token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new IssuedToken(token, expirationSeconds);
    }
}
