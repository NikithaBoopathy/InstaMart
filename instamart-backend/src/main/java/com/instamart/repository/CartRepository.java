package com.instamart.repository;

import com.instamart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByUserId(UUID userId);
}
