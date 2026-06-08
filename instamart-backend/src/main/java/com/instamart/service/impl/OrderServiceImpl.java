package com.instamart.service.impl;

import com.instamart.dto.request.PlaceOrderRequest;
import com.instamart.entity.*;
import com.instamart.enums.*;
import com.instamart.exception.AppException;
import com.instamart.repository.*;
import com.instamart.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service @RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final AddressRepository addressRepo;
    private final CartService cartService;

    private User getUser(String email) {
        return userRepo.findByEmail(email).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    @Override @Transactional
    public Order placeOrder(String email, PlaceOrderRequest req) {
        User user = getUser(email);
        Cart cart = cartService.getCart(email);
        if (cart.getItems().isEmpty()) throw new AppException("Cart is empty", HttpStatus.BAD_REQUEST);

        Address address = req.getAddressId() != null
                ? addressRepo.findById(req.getAddressId()).orElseThrow(() -> new AppException("Address not found", HttpStatus.NOT_FOUND))
                : null;

        BigDecimal subtotal = cart.getItems().stream()
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryFee = subtotal.compareTo(BigDecimal.valueOf(199)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(30);
        BigDecimal total = subtotal.add(deliveryFee);

        Order order = Order.builder()
                .user(user).address(address)
                .subtotal(subtotal).deliveryFee(deliveryFee).discount(BigDecimal.ZERO).totalAmount(total)
                .paymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "MOCK")
                .paymentStatus(PaymentStatus.PAID)   // mock payment → instantly paid
                .paymentRef("MOCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .notes(req.getNotes())
                .estimatedDelivery(LocalDateTime.now().plusMinutes(30))
                .build();

        List<OrderItem> items = new ArrayList<>();
        for (CartItem ci : cart.getItems()) {
            Product p = ci.getProduct();
            items.add(OrderItem.builder().order(order).product(p)
                    .productName(p.getName()).productImage(p.getImageUrl()).unit(p.getUnit())
                    .unitPrice(p.getPrice()).quantity(ci.getQuantity())
                    .totalPrice(p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()))).build());
        }
        order.setItems(items);

        OrderStatusHistory hist = OrderStatusHistory.builder().order(order)
                .status(OrderStatus.PLACED.name()).message("Order placed successfully").build();
        order.setStatusHistory(new ArrayList<>(List.of(hist)));

        Order saved = orderRepo.save(order);
        cartService.clearCart(email);
        return saved;
    }

    @Override public Page<Order> getMyOrders(String email, Pageable p) {
        return orderRepo.findByUserIdOrderByCreatedAtDesc(getUser(email).getId(), p);
    }
    @Override public Order getOrderById(String email, UUID id) {
        Order o = orderRepo.findById(id).orElseThrow(() -> new AppException("Order not found", HttpStatus.NOT_FOUND));
        if (!o.getUser().getEmail().equals(email)) throw new AppException("Forbidden", HttpStatus.FORBIDDEN);
        return o;
    }
    @Override public Order getOrderByIdAdmin(UUID id) {
        return orderRepo.findById(id).orElseThrow(() -> new AppException("Order not found", HttpStatus.NOT_FOUND));
    }
    @Override public Page<Order> getAllOrders(Pageable p) { return orderRepo.findAllByOrderByCreatedAtDesc(p); }
    @Override @Transactional
    public Order updateStatus(UUID orderId, OrderStatus status) {
        Order order = getOrderByIdAdmin(orderId);
        order.setStatus(status);
        if (status == OrderStatus.DELIVERED) order.setDeliveredAt(LocalDateTime.now());
        OrderStatusHistory hist = OrderStatusHistory.builder().order(order)
                .status(status.name()).message("Status updated to " + status).build();
        order.getStatusHistory().add(hist);
        return orderRepo.save(order);
    }
}
