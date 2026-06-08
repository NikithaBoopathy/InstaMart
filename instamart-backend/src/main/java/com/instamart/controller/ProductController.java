package com.instamart.controller;

import com.instamart.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/products") @RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(productService.getAll(PageRequest.of(page, size)));
    }

    @GetMapping("/featured")
    public ResponseEntity<?> featured() { return ResponseEntity.ok(productService.getFeatured()); }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String q, @RequestParam(defaultValue="0") int page) {
        return ResponseEntity.ok(productService.search(q, PageRequest.of(page, 20)));
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<?> byCategory(@PathVariable UUID id, @RequestParam(defaultValue="0") int page) {
        return ResponseEntity.ok(productService.getByCategory(id, PageRequest.of(page, 20)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable UUID id) { return ResponseEntity.ok(productService.getById(id)); }
}
