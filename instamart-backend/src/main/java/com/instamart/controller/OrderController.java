package com.instamart.controller;

import com.instamart.dto.request.PlaceOrderRequest;
import com.instamart.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/orders") @RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> place(@AuthenticationPrincipal UserDetails u, @RequestBody PlaceOrderRequest req) {
        return ResponseEntity.ok(orderService.placeOrder(u.getUsername(), req));
    }

    @GetMapping
    public ResponseEntity<?> myOrders(@AuthenticationPrincipal UserDetails u,
            @RequestParam(defaultValue="0") int page) {
        return ResponseEntity.ok(orderService.getMyOrders(u.getUsername(), PageRequest.of(page, 10)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@AuthenticationPrincipal UserDetails u, @PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrderById(u.getUsername(), id));
    }
}
