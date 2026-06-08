package com.instamart.repository;

import com.instamart.entity.Product;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.*;
import java.util.*;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    Page<Product> findByIsActiveTrue(Pageable pageable);
    Page<Product> findByCategoryIdAndIsActiveTrue(UUID categoryId, Pageable pageable);
    List<Product> findByIsFeaturedTrueAndIsActiveTrue();
    Optional<Product> findBySlug(String slug);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Product> search(@Param("q") String query, Pageable pageable);
}
