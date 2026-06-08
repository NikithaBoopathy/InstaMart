package com.instamart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {
    @Id @UuidGenerator UUID id;
    @Column(unique = true) String name;
    @Column(unique = true) String slug;
    String imageUrl;
    String description;
    boolean isActive;
    int sortOrder;
    LocalDateTime createdAt;

    @PrePersist void onCreate() { createdAt = LocalDateTime.now(); isActive = true; }
}
