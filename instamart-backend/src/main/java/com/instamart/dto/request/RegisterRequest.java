package com.instamart.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank String name;
    @Email @NotBlank String email;
    @NotBlank @Size(min=6) String password;
    String phone;
}
