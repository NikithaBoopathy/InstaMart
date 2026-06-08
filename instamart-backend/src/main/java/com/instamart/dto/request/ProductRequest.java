package com.instamart.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductRequest {
    UUID categoryId;
    String name;
    String slug;
    String description;
    String brand;
    String imageUrl;
    BigDecimal price;
    BigDecimal mrp;
    String unit;
    int stockQuantity;
    boolean isActive;
    boolean isFeatured;
}
