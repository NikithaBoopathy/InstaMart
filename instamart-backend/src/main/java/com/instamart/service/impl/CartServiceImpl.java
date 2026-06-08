package com.instamart.service.impl;

import com.instamart.dto.request.CartRequest;
import com.instamart.entity.*;
import com.instamart.exception.AppException;
import com.instamart.repository.*;
import com.instamart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    private User getUser(String email) {
        return userRepo.findByEmail(email).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public Cart getCart(String email) {
        User user = getUser(email);
        return cartRepo.findByUserId(user.getId()).orElseGet(() -> cartRepo.save(Cart.builder().user(user).build()));
    }

    @Override @Transactional
    public Cart updateCart(String email, CartRequest req) {
        Cart cart = getCart(email);
        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND));

        if (req.getQuantity() <= 0) {
            cart.getItems().removeIf(i -> i.getProduct().getId().equals(req.getProductId()));
        } else {
            CartItem existing = cart.getItems().stream()
                    .filter(i -> i.getProduct().getId().equals(req.getProductId()))
                    .findFirst().orElse(null);
            if (existing != null) {
                existing.setQuantity(req.getQuantity());
            } else {
                cart.getItems().add(CartItem.builder().cart(cart).product(product).quantity(req.getQuantity()).build());
            }
        }
        return cartRepo.save(cart);
    }

    @Override @Transactional
    public void clearCart(String email) {
        Cart cart = getCart(email);
        cart.getItems().clear();
        cartRepo.save(cart);
    }
}
