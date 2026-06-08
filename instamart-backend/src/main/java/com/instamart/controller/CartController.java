package com.instamart.controller;

import com.instamart.dto.request.CartRequest;
import com.instamart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/cart") @RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<?> getCart(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(cartService.getCart(u.getUsername()));
    }

    @PostMapping
    public ResponseEntity<?> update(@AuthenticationPrincipal UserDetails u, @RequestBody CartRequest req) {
        return ResponseEntity.ok(cartService.updateCart(u.getUsername(), req));
    }

    @DeleteMapping
    public ResponseEntity<?> clear(@AuthenticationPrincipal UserDetails u) {
        cartService.clearCart(u.getUsername());
        return ResponseEntity.ok().build();
    }
}
