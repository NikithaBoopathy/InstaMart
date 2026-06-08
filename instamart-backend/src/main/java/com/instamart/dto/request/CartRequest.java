package com.instamart.dto.request;

import lombok.Data;
import java.util.UUID;

@Data
public class CartRequest {
    UUID productId;
    int quantity;  // 0 = remove
}
