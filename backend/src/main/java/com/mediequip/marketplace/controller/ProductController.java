package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.ProductDTO;
import com.mediequip.marketplace.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.mediequip.marketplace.service.UserService;
import com.mediequip.marketplace.entity.User;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        System.out.println("ProductController - Returning total products: " + products.size());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/equipment")
    public ResponseEntity<List<ProductDTO>> getEquipmentProducts() {
        List<ProductDTO> products = productService.getProductsByType(com.mediequip.marketplace.entity.ProductType.EQUIPMENT);
        System.out.println("ProductController - Returning equipment products: " + products.size());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/spare-parts")
    public ResponseEntity<List<ProductDTO>> getSparePartsProducts() {
        List<ProductDTO> products = productService.getProductsByType(com.mediequip.marketplace.entity.ProductType.SPARE_PART);
        System.out.println("ProductController - Returning spare-parts products: " + products.size());
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String category) {
        List<ProductDTO> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String name) {
        List<ProductDTO> products = productService.searchProducts(name);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<ProductDTO>> getAvailableProducts() {
        List<ProductDTO> products = productService.getAvailableProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProductDTO>> getFeaturedProducts() {
        List<ProductDTO> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories(@RequestParam(required = false) String type) {
        if (type != null && !type.trim().isEmpty()) {
            try {
                com.mediequip.marketplace.entity.ProductType pType = com.mediequip.marketplace.entity.ProductType.valueOf(type.toUpperCase());
                List<String> categories = productService.getCategoriesByType(pType);
                return ResponseEntity.ok(categories);
            } catch (IllegalArgumentException e) {
                // fall through to return all categories if type is invalid
            }
        }
        List<String> categories = productService.getCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/{id}/restore")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ProductDTO> restoreProduct(@PathVariable Long id, @AuthenticationPrincipal UserDetails currentUserDetails) {
        User currentUser = userService.getUserByIdentifier(currentUserDetails.getUsername());
        if (!currentUser.isSuperOwner()) {
            throw new RuntimeException("Operation denied: Only the Super Owner can restore deleted products.");
        }
        ProductDTO restored = productService.restoreProduct(id);
        return ResponseEntity.ok(restored);
    }

    @PostMapping("/{id}/duplicate")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ProductDTO> duplicateProduct(@PathVariable Long id) {
        ProductDTO duplicated = productService.duplicateProduct(id);
        return ResponseEntity.ok(duplicated);
    }
}
