package com.instamart.service.impl;

import com.instamart.dto.request.ProductRequest;
import com.instamart.entity.*;
import com.instamart.exception.AppException;
import com.instamart.repository.*;
import com.instamart.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.*;

@Service @RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;

    @Override public Page<Product> getAll(Pageable p) { return productRepo.findByIsActiveTrue(p); }
    @Override public Page<Product> getByCategory(UUID catId, Pageable p) { return productRepo.findByCategoryIdAndIsActiveTrue(catId, p); }
    @Override public List<Product> getFeatured() { return productRepo.findByIsFeaturedTrueAndIsActiveTrue(); }
    @Override public Product getById(UUID id) { return productRepo.findById(id).orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND)); }
    @Override public Page<Product> search(String q, Pageable p) { return productRepo.search(q, p); }

    @Override
    public Product create(ProductRequest req) {
        Category cat = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> new AppException("Category not found", HttpStatus.NOT_FOUND));
        Product p = Product.builder().category(cat).name(req.getName()).slug(req.getSlug())
                .description(req.getDescription()).brand(req.getBrand()).imageUrl(req.getImageUrl())
                .price(req.getPrice()).mrp(req.getMrp()).unit(req.getUnit())
                .stockQuantity(req.getStockQuantity()).isActive(req.isActive()).isFeatured(req.isFeatured()).build();
        return productRepo.save(p);
    }

    @Override
    public Product update(UUID id, ProductRequest req) {
        Product p = getById(id);
        Category cat = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> new AppException("Category not found", HttpStatus.NOT_FOUND));
        p.setCategory(cat); p.setName(req.getName()); p.setSlug(req.getSlug());
        p.setDescription(req.getDescription()); p.setBrand(req.getBrand()); p.setImageUrl(req.getImageUrl());
        p.setPrice(req.getPrice()); p.setMrp(req.getMrp()); p.setUnit(req.getUnit());
        p.setStockQuantity(req.getStockQuantity()); p.setActive(req.isActive()); p.setFeatured(req.isFeatured());
        return productRepo.save(p);
    }

    @Override
    public void delete(UUID id) { Product p = getById(id); p.setActive(false); productRepo.save(p); }
}
