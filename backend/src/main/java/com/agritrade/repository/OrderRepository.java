package com.agritrade.repository;

import com.agritrade.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findByProductFarmerMobile(String farmerMobile);
}
