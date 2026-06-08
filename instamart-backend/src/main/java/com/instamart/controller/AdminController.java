package com.instamart.controller;

import com.instamart.dto.request.ProductRequest;
import com.instamart.enums.OrderStatus;
import com.instamart.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
    private final ProductService productService;
    private final OrderService orderService;

    // Products
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest req) {
        return ResponseEntity.ok(productService.create(req));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable UUID id, @RequestBody ProductRequest req) {
        return ResponseEntity.ok(productService.update(id, req));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
        productService.delete(id);
        return ResponseEntity.ok().build();
    }

    // Orders
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(@RequestParam(defaultValue="0") int page) {
        return ResponseEntity.ok(orderService.getAllOrders(PageRequest.of(page, 20)));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrderByIdAdmin(id));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable UUID id, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
