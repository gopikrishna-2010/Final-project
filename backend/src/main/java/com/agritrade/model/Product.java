package com.agritrade.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String crop;

    @Column(columnDefinition = "LONGTEXT")
    private String image;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private List<String> images = new ArrayList<>();

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal rate;

    @Column(nullable = false)
    private String farmerMobile;

    private String date;
}
