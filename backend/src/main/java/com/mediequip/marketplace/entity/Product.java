package com.mediequip.marketplace.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.mediequip.marketplace.entity.ProductType;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name cannot exceed 200 characters")
    @Column(nullable = false)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price must have maximum 10 integer digits and 2 decimal digits")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
    
    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    @Column(nullable = false)
    private Integer stock;
    
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
    
    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type", nullable = false)
    private ProductType productType;
    
    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    private String sku;

    @Column(name = "hsn_code")
    private String hsnCode;

    @Column(name = "gst_percent")
    @Builder.Default
    private java.math.BigDecimal gstPercent = new java.math.BigDecimal("18.00");

    private String manufacturer;
    private String brand;

    @Column(name = "model_number")
    private String modelNumber;

    @Column(name = "country_of_origin")
    private String countryOfOrigin;

    @Column(name = "warranty_months")
    @Builder.Default
    private Integer warrantyMonths = 12;

    @Column(name = "youtube_url")
    private String youtubeUrl;

    @Column(name = "brochure_url")
    private String brochureUrl;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "damaged_stock")
    @Builder.Default
    private Integer damagedStock = 0;

    @Column(name = "returned_stock")
    @Builder.Default
    private Integer returnedStock = 0;

    @Column(name = "incoming_stock")
    @Builder.Default
    private Integer incomingStock = 0;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "specifications")
    private java.util.Map<String, String> specifications;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "features")
    private java.util.List<String> features;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
