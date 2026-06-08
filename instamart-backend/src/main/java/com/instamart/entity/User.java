package com.instamart.entity;

import com.instamart.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @UuidGenerator UUID id;
    String name;
    @Column(unique = true) String email;
    @Column(unique = true) String phone;
    String passwordHash;
    @Enumerated(EnumType.STRING) Role role;
    boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    @PrePersist void onCreate() { createdAt = updatedAt = LocalDateTime.now(); if (role == null) role = Role.CUSTOMER; isActive = true; }
    @PreUpdate  void onUpdate() { updatedAt = LocalDateTime.now(); }
}
