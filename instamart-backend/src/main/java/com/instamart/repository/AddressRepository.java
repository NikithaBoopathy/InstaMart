package com.instamart.repository;

import com.instamart.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findByUserId(UUID userId);
}
