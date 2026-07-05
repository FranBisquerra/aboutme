package com.fbisquerra.aboutme.user.domain.port;

import com.fbisquerra.aboutme.user.domain.model.User;

public interface AccessTokenIssuer {

    IssuedToken issue(User user);

    record IssuedToken(String token, long expiresInSeconds) {
    }
}
