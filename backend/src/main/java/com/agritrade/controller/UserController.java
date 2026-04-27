package com.agritrade.controller;

import com.agritrade.model.User;
import com.agritrade.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allow requests from any origin for development
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.save(user);
    }
    
    // Simple login mock - in a real app, use Spring Security
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginRequest) {
        return userService.findByUsername(loginRequest.getUsername())
                .filter(user -> user.getPassword().equals(loginRequest.getPassword()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}
