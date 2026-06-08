package com.instamart.service.impl;

import com.instamart.dto.request.*;
import com.instamart.entity.*;
import com.instamart.exception.AppException;
import com.instamart.repository.*;
import com.instamart.security.JwtUtil;
import com.instamart.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service @RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public Object register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new AppException("Email already registered", HttpStatus.CONFLICT);
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .build();
        userRepo.save(user);
        String token = jwtUtil.generate(user.getEmail(), user.getRole().name());
        return Map.of("token", token, "user", Map.of("name", user.getName(), "email", user.getEmail(), "role", user.getRole()));
    }

    @Override
    public Object login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash()))
            throw new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        String token = jwtUtil.generate(user.getEmail(), user.getRole().name());
        return Map.of("token", token, "user", Map.of("name", user.getName(), "email", user.getEmail(), "role", user.getRole()));
    }
}
