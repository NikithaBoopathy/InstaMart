package com.instamart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @UuidGenerator UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "category_id") Category category;
    String name;
    @Column(unique = true) String slug;
    String description;
    String brand;
    String imageUrl;
    BigDecimal price;
    BigDecimal mrp;
    String unit;
    int stockQuantity;
    boolean isActive;
    boolean isFeatured;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    @PrePersist void onCreate() { createdAt = updatedAt = LocalDateTime.now(); isActive = true; }
    @PreUpdate  void onUpdate() { updatedAt = LocalDateTime.now(); }
}
