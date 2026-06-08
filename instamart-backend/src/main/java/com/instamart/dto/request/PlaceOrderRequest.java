package com.instamart.dto.request;

import lombok.Data;
import java.util.UUID;

@Data
public class PlaceOrderRequest {
    UUID addressId;
    String paymentMethod; // MOCK
    String notes;
}
