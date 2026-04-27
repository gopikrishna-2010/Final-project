package com.agritrade.service;

import com.agritrade.model.Order;
import com.agritrade.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }

    public void deleteById(Long id) {
        orderRepository.deleteById(id);
    }
    
    public List<Order> findByBuyerId(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }
    
    public List<Order> findByFarmerMobile(String farmerMobile) {
        return orderRepository.findByProductFarmerMobile(farmerMobile);
    }
}
