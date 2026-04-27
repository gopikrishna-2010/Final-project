package com.agritrade.controller;

import com.agritrade.model.Product;
import com.agritrade.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable("id") Long id, @RequestBody Product productDetails) {
        return productService.findById(id)
                .map(product -> {
                    product.setCrop(productDetails.getCrop());
                    product.setImage(productDetails.getImage());
                    product.setImages(productDetails.getImages());
                    product.setQuantity(productDetails.getQuantity());
                    product.setRate(productDetails.getRate());
                    product.setFarmerMobile(productDetails.getFarmerMobile());
                    product.setDate(productDetails.getDate());
                    return ResponseEntity.ok(productService.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id) {
        return productService.findById(id)
                .map(product -> {
                    productService.deleteById(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/farmer/{farmerMobile}")
    public List<Product> getProductsByFarmerMobile(@PathVariable("farmerMobile") String farmerMobile) {
        return productService.findByFarmerMobile(farmerMobile);
    }
}
