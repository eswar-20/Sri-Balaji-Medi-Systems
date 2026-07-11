package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.ProductDTO;
import com.mediequip.marketplace.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import com.mediequip.marketplace.repository.WebsiteSettingRepository;
import com.mediequip.marketplace.entity.WebsiteSetting;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/meta")
@RequiredArgsConstructor
public class MetaController {

    private final ProductService productService;
    
    @Autowired
    private WebsiteSettingRepository websiteSettingRepository;

    @Autowired
    private com.mediequip.marketplace.repository.ProductRepository productRepository;
    @Autowired
    private com.mediequip.marketplace.repository.CategoryRepository categoryRepository;
    @Autowired
    private com.mediequip.marketplace.repository.UserRepository userRepository;
    @Autowired
    private com.mediequip.marketplace.repository.OrderRepository orderRepository;
    @Autowired
    private com.mediequip.marketplace.repository.ServiceRequestRepository serviceRequestRepository;
    @Autowired
    private com.mediequip.marketplace.repository.PaymentRepository paymentRepository;
    @Autowired
    private com.mediequip.marketplace.repository.AuditLogRepository auditLogRepository;

    @GetMapping("/db-verification")
    public ResponseEntity<Map<String, Long>> getDbVerification() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("products", productRepository.count());
        counts.put("categories", categoryRepository.count());
        counts.put("users", userRepository.count());
        counts.put("orders", orderRepository.count());
        counts.put("service_requests", serviceRequestRepository.count());
        counts.put("payment_transactions", paymentRepository.count());
        counts.put("audit_logs", auditLogRepository.count());
        return ResponseEntity.ok(counts);
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, String>> getSettings() {
        List<WebsiteSetting> all = websiteSettingRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (WebsiteSetting s : all) {
            map.put(s.getKey(), s.getValue());
        }
        return ResponseEntity.ok(map);
    }

    @GetMapping("/products/featured")
    public ResponseEntity<List<ProductDTO>> getFeatured() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/products/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getCategories());
    }

    @GetMapping("/products/categories/equipment")
    public ResponseEntity<List<String>> getEquipmentCategories() {
        return ResponseEntity.ok(productService.getCategoriesByType(com.mediequip.marketplace.entity.ProductType.EQUIPMENT));
    }

    @GetMapping("/products/categories/spare-parts")
    public ResponseEntity<List<String>> getSparePartsCategories() {
        return ResponseEntity.ok(productService.getCategoriesByType(com.mediequip.marketplace.entity.ProductType.SPARE_PART));
    }
}
