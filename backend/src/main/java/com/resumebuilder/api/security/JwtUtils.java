package com.resumebuilder.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Key;
import java.util.Date;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;
    
    private Key signingKey;
    
    @PostConstruct
    public void init() {
        try {
            // Decode the Base64-encoded secret
            byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
            signingKey = Keys.hmacShaKeyFor(keyBytes);
            logger.info("JWT signing key initialized successfully");
        } catch (Exception e) {
            logger.error("Failed to initialize JWT signing key: {}", e.getMessage());
            // Fallback to a secure generated key
            signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            logger.info("Using fallback generated JWT signing key");
        }
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (JwtException e) {
            logger.error("JWT validation error: {}", e.getMessage());
            return false;
        }
    }
} 