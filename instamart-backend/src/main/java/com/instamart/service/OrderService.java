package com.instamart.service;

import com.instamart.dto.request.PlaceOrderRequest;
import com.instamart.entity.Order;
import com.instamart.enums.OrderStatus;
import org.springframework.data.domain.*;
import java.util.UUID;

public interface OrderService {
    Order placeOrder(String email, PlaceOrderRequest req);
    Page<Order> getMyOrders(String email, Pageable pageable);
    Order getOrderById(String email, UUID orderId);
    Order getOrderByIdAdmin(UUID orderId);
    Page<Order> getAllOrders(Pageable pageable);
    Order updateStatus(UUID orderId, OrderStatus status);
}
