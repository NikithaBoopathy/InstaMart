package com.instamart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "cart_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CartItem {
    @Id @UuidGenerator UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "cart_id") Cart cart;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_id") Product product;
    int quantity;
    LocalDateTime addedAt;

    @PrePersist void onCreate() { addedAt = LocalDateTime.now(); }
}
