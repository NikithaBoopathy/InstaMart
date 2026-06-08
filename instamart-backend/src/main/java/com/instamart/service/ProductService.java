package com.instamart.service;

import com.instamart.dto.request.ProductRequest;
import com.instamart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.*;

public interface ProductService {
    Page<Product> getAll(Pageable pageable);
    Page<Product> getByCategory(UUID categoryId, Pageable pageable);
    List<Product> getFeatured();
    Product getById(UUID id);
    Page<Product> search(String query, Pageable pageable);
    Product create(ProductRequest req);
    Product update(UUID id, ProductRequest req);
    void delete(UUID id);
}
