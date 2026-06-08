package com.instamart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "addresses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Address {
    @Id @UuidGenerator UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") User user;
    String label;
    String addressLine1;
    String addressLine2;
    String city;
    String state;
    String pincode;
    boolean isDefault;
    LocalDateTime createdAt;

    @PrePersist void onCreate() { createdAt = LocalDateTime.now(); }
}
