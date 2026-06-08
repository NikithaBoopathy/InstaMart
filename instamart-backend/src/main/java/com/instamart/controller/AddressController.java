package com.instamart.controller;

import com.instamart.dto.request.AddressRequest;
import com.instamart.entity.*;
import com.instamart.exception.AppException;
import com.instamart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/addresses") @RequiredArgsConstructor
public class AddressController {
    private final AddressRepository addressRepo;
    private final UserRepository userRepo;

    @GetMapping
    public Object getAll(@AuthenticationPrincipal UserDetails u) {
        User user = userRepo.findByEmail(u.getUsername()).orElseThrow();
        return addressRepo.findByUserId(user.getId());
    }

    @PostMapping
    public Object add(@AuthenticationPrincipal UserDetails u, @RequestBody AddressRequest req) {
        User user = userRepo.findByEmail(u.getUsername()).orElseThrow();
        Address addr = Address.builder().user(user).label(req.getLabel())
                .addressLine1(req.getAddressLine1()).addressLine2(req.getAddressLine2())
                .city(req.getCity()).state(req.getState()).pincode(req.getPincode())
                .isDefault(req.isDefault()).build();
        return addressRepo.save(addr);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable java.util.UUID id, @AuthenticationPrincipal UserDetails u) {
        Address addr = addressRepo.findById(id).orElseThrow(() -> new AppException("Not found", HttpStatus.NOT_FOUND));
        if (!addr.getUser().getEmail().equals(u.getUsername())) throw new AppException("Forbidden", HttpStatus.FORBIDDEN);
        addressRepo.delete(addr);
        return ResponseEntity.ok().build();
    }
}
