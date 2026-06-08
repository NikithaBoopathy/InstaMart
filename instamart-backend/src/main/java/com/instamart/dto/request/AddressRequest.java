package com.instamart.dto.request;

import lombok.Data;

@Data
public class AddressRequest {
    String label;
    String addressLine1;
    String addressLine2;
    String city;
    String state;
    String pincode;
    boolean isDefault;
}
