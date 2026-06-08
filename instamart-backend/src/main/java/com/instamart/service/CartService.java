package com.instamart.service;

import com.instamart.dto.request.CartRequest;
import com.instamart.entity.Cart;

public interface CartService {
    Cart getCart(String email);
    Cart updateCart(String email, CartRequest req);
    void clearCart(String email);
}
