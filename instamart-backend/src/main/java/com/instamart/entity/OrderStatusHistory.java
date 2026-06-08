package com.instamart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "order_status_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderStatusHistory {
    @Id @UuidGenerator UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "order_id") Order order;
    String status;
    String message;
    LocalDateTime changedAt;

    @PrePersist void onCreate() { changedAt = LocalDateTime.now(); }
}
