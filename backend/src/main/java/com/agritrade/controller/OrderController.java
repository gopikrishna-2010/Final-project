package com.agritrade.controller;

import com.agritrade.model.Order;
import com.agritrade.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable("id") Long id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        order.setStatus(Order.OrderStatus.PENDING);
        return orderService.save(order);
    }
    
    @GetMapping("/buyer/{buyerId}")
    public List<Order> getOrdersByBuyer(@PathVariable("buyerId") Long buyerId) {
        return orderService.findByBuyerId(buyerId);
    }
    
    @GetMapping("/farmer/{farmerMobile}")
    public List<Order> getOrdersByFarmer(@PathVariable("farmerMobile") String farmerMobile) {
        return orderService.findByFarmerMobile(farmerMobile);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable("id") Long id, @RequestParam("status") Order.OrderStatus status) {
        return orderService.findById(id)
                .map(order -> {
                    order.setStatus(status);
                    return ResponseEntity.ok(orderService.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
