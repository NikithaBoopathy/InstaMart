package com.instamart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.math.BigDecimal;
import java.util.UUID;

@Entity @Table(name = "order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {
    @Id @UuidGenerator UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "order_id") Order order;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_id") Product product;
    String productName;
    String productImage;
    String unit;
    BigDecimal unitPrice;
    int quantity;
    BigDecimal totalPrice;
}
