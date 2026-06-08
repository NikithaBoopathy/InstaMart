package com.instamart.entity;

import com.instamart.enums.OrderStatus;
import com.instamart.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity @Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {
    @Id @UuidGenerator UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "address_id") Address address;
    BigDecimal subtotal;
    BigDecimal deliveryFee;
    BigDecimal discount;
    BigDecimal totalAmount;
    @Enumerated(EnumType.STRING) OrderStatus status;
    String paymentMethod;
    @Enumerated(EnumType.STRING) PaymentStatus paymentStatus;
    String paymentRef;
    LocalDateTime estimatedDelivery;
    LocalDateTime deliveredAt;
    String notes;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @OrderBy("changedAt ASC")
    List<OrderStatusHistory> statusHistory = new ArrayList<>();

    @PrePersist void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
        if (status == null) status = OrderStatus.PLACED;
        if (paymentStatus == null) paymentStatus = PaymentStatus.PENDING;
    }
    @PreUpdate void onUpdate() { updatedAt = LocalDateTime.now(); }
}
