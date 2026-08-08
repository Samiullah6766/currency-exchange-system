package com.samiullah.financial_system.JWT.Util;

import com.samiullah.financial_system.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtService {

    private static final String SECRET =
            "e4f2b7c8a9d6f1e3c5b8a7d9f2c4e6b1e8f3a7c9d5b2e4f6a8c1d3e7f9b5a2";

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("role", user.getRole())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }
}