package com.instamart.repository;

import com.instamart.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByIsActiveTrueOrderBySortOrderAsc();
    Optional<Category> findBySlug(String slug);
}
