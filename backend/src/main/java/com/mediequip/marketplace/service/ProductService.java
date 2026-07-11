package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.ProductDTO;
import com.mediequip.marketplace.entity.Product;
import com.mediequip.marketplace.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.mediequip.marketplace.entity.Category;
import com.mediequip.marketplace.entity.ProductType;
import com.mediequip.marketplace.repository.CategoryRepository;
import com.mediequip.marketplace.repository.AuditLogRepository;
import com.mediequip.marketplace.entity.AuditLog;
import org.springframework.security.core.context.SecurityContextHolder;
import com.mediequip.marketplace.repository.OrderItemRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final OrderItemRepository orderItemRepository;
    
    public List<ProductDTO> getAllProducts() {
        List<Product> rawProducts = productRepository.findAllActive();
        System.out.println("ProductService - Database Product Count = " + productRepository.count());
        System.out.println("ProductService - Repository Returned = " + rawProducts.size());
        return rawProducts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByType(ProductType type) {
        List<Product> typeProducts = productRepository.findByProductTypeActive(type);
        if (type == ProductType.EQUIPMENT) {
            System.out.println("ProductService - Equipment Count = " + typeProducts.size());
        } else if (type == ProductType.SPARE_PART) {
            System.out.println("ProductService - Spare Parts Count = " + typeProducts.size());
        }
        return typeProducts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByTypeAndCategory(ProductType type, String category) {
        return productRepository.findByProductTypeAndCategoryNameActive(type, category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDTO(product);
    }
    
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        logAdminAction("Product Added", "Created product: " + savedProduct.getName() + " (ID: " + savedProduct.getId() + ")");
        return convertToDTO(savedProduct);
    }
    
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        existingProduct.setName(productDTO.getName());
        Category category = null;
        if (productDTO.getCategory() != null) {
            String catName = productDTO.getCategory().trim();
            ProductType type = productDTO.getProductType() != null ? 
                    ProductType.valueOf(productDTO.getProductType()) : ProductType.EQUIPMENT;
            category = categoryRepository.findByName(catName)
                    .orElseGet(() -> categoryRepository.save(Category.builder()
                            .name(catName)
                            .productType(type)
                            .build()));
        }
        existingProduct.setCategory(category);
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setStock(productDTO.getStock());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setImageUrl(productDTO.getImageUrl());
        existingProduct.setEnabled(productDTO.isEnabled());
        existingProduct.setSku(productDTO.getSku());
        existingProduct.setHsnCode(productDTO.getHsnCode());
        existingProduct.setGstPercent(productDTO.getGstPercent());
        existingProduct.setManufacturer(productDTO.getManufacturer());
        existingProduct.setBrand(productDTO.getBrand());
        existingProduct.setModelNumber(productDTO.getModelNumber());
        existingProduct.setCountryOfOrigin(productDTO.getCountryOfOrigin());
        existingProduct.setWarrantyMonths(productDTO.getWarrantyMonths());
        existingProduct.setYoutubeUrl(productDTO.getYoutubeUrl());
        existingProduct.setBrochureUrl(productDTO.getBrochureUrl());
        existingProduct.setThumbnailUrl(productDTO.getThumbnailUrl());
        existingProduct.setDamagedStock(productDTO.getDamagedStock());
        existingProduct.setReturnedStock(productDTO.getReturnedStock());
        existingProduct.setIncomingStock(productDTO.getIncomingStock());
        existingProduct.setSpecifications(productDTO.getSpecifications());
        existingProduct.setFeatures(productDTO.getFeatures());
        
        Product updatedProduct = productRepository.save(existingProduct);
        logAdminAction("Product Edited", "Updated product: " + updatedProduct.getName() + " (ID: " + updatedProduct.getId() + ")");
        return convertToDTO(updatedProduct);
    }
    
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setDeleted(true);
        productRepository.save(product);
        logAdminAction("Product Deleted", "Soft-removed product: " + product.getName() + " (ID: " + id + ")");
    }

    public ProductDTO restoreProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setDeleted(false);
        Product restored = productRepository.save(product);
        logAdminAction("Product Restored", "Restored product: " + restored.getName() + " (ID: " + id + ")");
        return convertToDTO(restored);
    }

    public ProductDTO duplicateProduct(Long id) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        Product copy = Product.builder()
                .name(existing.getName() + " (Copy)")
                .category(existing.getCategory())
                .productType(existing.getProductType())
                .price(existing.getPrice())
                .stock(existing.getStock())
                .description(existing.getDescription())
                .imageUrl(existing.getImageUrl())
                .specifications(existing.getSpecifications() != null ? new java.util.HashMap<>(existing.getSpecifications()) : null)
                .features(existing.getFeatures() != null ? new java.util.ArrayList<>(existing.getFeatures()) : null)
                .enabled(existing.isEnabled())
                .sku(existing.getSku() != null ? existing.getSku() + "-COPY" : null)
                .hsnCode(existing.getHsnCode())
                .gstPercent(existing.getGstPercent())
                .manufacturer(existing.getManufacturer())
                .brand(existing.getBrand())
                .modelNumber(existing.getModelNumber())
                .countryOfOrigin(existing.getCountryOfOrigin())
                .warrantyMonths(existing.getWarrantyMonths())
                .youtubeUrl(existing.getYoutubeUrl())
                .brochureUrl(existing.getBrochureUrl())
                .thumbnailUrl(existing.getThumbnailUrl())
                .build();
        Product saved = productRepository.save(copy);
        logAdminAction("Product Duplicated", "Cloned product: " + existing.getName() + " -> " + saved.getName() + " (ID: " + saved.getId() + ")");
        return convertToDTO(saved);
    }
    
    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategoryNameActive(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCaseActive(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProductsByType(ProductType type, String name) {
        return productRepository.findByProductTypeAndNameContainingIgnoreCaseActive(type, name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getAvailableProducts() {
        return productRepository.findAvailableProducts().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findAvailableProducts().stream()
                .limit(10)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<String> getCategories() {
        return categoryRepository.findActiveCategories().stream()
                .map(Category::getName)
                .collect(Collectors.toList());
    }

    public List<String> getCategoriesByType(ProductType type) {
        return categoryRepository.findActiveCategoriesByProductType(type).stream()
                .map(Category::getName)
                .collect(Collectors.toList());
    }
    private ProductDTO convertToDTO(Product product) {
        int reserved = orderItemRepository.sumReservedQuantityByProductId(product.getId());
        int available = Math.max(0, product.getStock() - reserved);
        
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory() != null ? product.getCategory().getName() : null)
                .productType(product.getProductType() != null ? product.getProductType().name() : null)
                .price(product.getPrice())
                .stock(product.getStock())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .specifications(product.getSpecifications())
                .features(product.getFeatures())
                .enabled(product.isEnabled())
                .deleted(product.isDeleted())
                .sku(product.getSku())
                .hsnCode(product.getHsnCode())
                .gstPercent(product.getGstPercent())
                .manufacturer(product.getManufacturer())
                .brand(product.getBrand())
                .modelNumber(product.getModelNumber())
                .countryOfOrigin(product.getCountryOfOrigin())
                .warrantyMonths(product.getWarrantyMonths())
                .youtubeUrl(product.getYoutubeUrl())
                .brochureUrl(product.getBrochureUrl())
                .thumbnailUrl(product.getThumbnailUrl())
                .damagedStock(product.getDamagedStock())
                .returnedStock(product.getReturnedStock())
                .incomingStock(product.getIncomingStock())
                .reservedStock(reserved)
                .availableStock(available)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
    
    private Product convertToEntity(ProductDTO productDTO) {
        Category category = null;
        if (productDTO.getCategory() != null) {
            String catName = productDTO.getCategory().trim();
            ProductType type = productDTO.getProductType() != null ? 
                    ProductType.valueOf(productDTO.getProductType()) : ProductType.EQUIPMENT;
            category = categoryRepository.findByName(catName)
                    .orElseGet(() -> categoryRepository.save(Category.builder()
                            .name(catName)
                            .productType(type)
                            .build()));
        }
        return Product.builder()
                .id(productDTO.getId())
                .name(productDTO.getName())
                .category(category)
                .productType(productDTO.getProductType() != null ? ProductType.valueOf(productDTO.getProductType()) : null)
                .price(productDTO.getPrice())
                .stock(productDTO.getStock())
                .description(productDTO.getDescription())
                .imageUrl(productDTO.getImageUrl())
                .specifications(productDTO.getSpecifications())
                .features(productDTO.getFeatures())
                .enabled(productDTO.isEnabled())
                .deleted(productDTO.isDeleted())
                .sku(productDTO.getSku())
                .hsnCode(productDTO.getHsnCode())
                .gstPercent(productDTO.getGstPercent() != null ? productDTO.getGstPercent() : new java.math.BigDecimal("18.00"))
                .manufacturer(productDTO.getManufacturer())
                .brand(productDTO.getBrand())
                .modelNumber(productDTO.getModelNumber())
                .countryOfOrigin(productDTO.getCountryOfOrigin())
                .warrantyMonths(productDTO.getWarrantyMonths() != null ? productDTO.getWarrantyMonths() : 12)
                .youtubeUrl(productDTO.getYoutubeUrl())
                .brochureUrl(productDTO.getBrochureUrl())
                .thumbnailUrl(productDTO.getThumbnailUrl())
                .damagedStock(productDTO.getDamagedStock() != null ? productDTO.getDamagedStock() : 0)
                .returnedStock(productDTO.getReturnedStock() != null ? productDTO.getReturnedStock() : 0)
                .incomingStock(productDTO.getIncomingStock() != null ? productDTO.getIncomingStock() : 0)
                .build();
    }

    private void logAdminAction(String actionName, String details) {
        try {
            org.springframework.security.core.Authentication auth = 
                    SecurityContextHolder.getContext().getAuthentication();
            String username = (auth != null) ? auth.getName() : "SYSTEM";
            auditLogRepository.save(AuditLog.builder()
                    .actionName(actionName)
                    .performedBy(username)
                    .details(details)
                    .build());
        } catch (Exception e) {
            System.err.println("Failed to log audit action: " + e.getMessage());
        }
    }
}
