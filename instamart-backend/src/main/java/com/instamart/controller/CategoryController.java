package com.instamart.controller;

import com.instamart.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/categories") @RequiredArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepo;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(categoryRepo.findByIsActiveTrueOrderBySortOrderAsc());
    }
}
