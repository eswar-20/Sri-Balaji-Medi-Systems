package com.mediequip.marketplace.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String category;
    private String productType;
    private BigDecimal price;
    private Integer stock;
    private String description;
    private String imageUrl;
    private java.util.Map<String, String> specifications;
    private java.util.List<String> features;
    private boolean enabled;
    private boolean deleted;
    private String sku;
    private String hsnCode;
    private BigDecimal gstPercent;
    private String manufacturer;
    private String brand;
    private String modelNumber;
    private String countryOfOrigin;
    private Integer warrantyMonths;
    private String youtubeUrl;
    private String brochureUrl;
    private String thumbnailUrl;
    private Integer damagedStock;
    private Integer returnedStock;
    private Integer incomingStock;
    private Integer reservedStock;
    private Integer availableStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
