package com.instamart.service;

import com.instamart.dto.request.*;

public interface AuthService {
    Object register(RegisterRequest req);
    Object login(LoginRequest req);
}
