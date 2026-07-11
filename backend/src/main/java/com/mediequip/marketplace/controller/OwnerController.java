package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.OwnerDashboardDTO;
import com.mediequip.marketplace.dto.ProductDTO;
import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.entity.AuditLog;
import com.mediequip.marketplace.service.OwnerService;
import com.mediequip.marketplace.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
public class OwnerController {

    private final OwnerService ownerService;
    private final UserService userService;
    
    @org.springframework.beans.factory.annotation.Autowired
    private com.mediequip.marketplace.repository.WebsiteSettingRepository websiteSettingRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private com.mediequip.marketplace.repository.StockAdjustmentLogRepository stockAdjustmentLogRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private com.mediequip.marketplace.repository.ProductRepository productRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<OwnerDashboardDTO> getDashboard() {
        return ResponseEntity.ok(ownerService.getDashboard());
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<ProductDTO>> getInventory() {
        return ResponseEntity.ok(ownerService.getInventory());
    }

    @GetMapping("/analytics")
    public ResponseEntity<OwnerDashboardDTO> getAnalytics() {
        return ResponseEntity.ok(ownerService.getDashboard());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users/promote")
    public ResponseEntity<User> promoteUser(
            @RequestParam Long userId, 
            @RequestParam String role, 
            @AuthenticationPrincipal UserDetails currentUserDetails) {
        
        User currentUser = userService.getUserByIdentifier(currentUserDetails.getUsername());
        
        // No self-promotion
        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("Operation failed: You cannot promote or change your own role.");
        }
        
        User targetUser = userService.getUserById(userId);
        boolean isSuperOwner = currentUser.isSuperOwner();
        
        if ((User.Role.valueOf(role.toUpperCase()) == User.Role.OWNER || targetUser.getRole() == User.Role.OWNER) && !isSuperOwner) {
            throw new RuntimeException("Operation denied: Only the Super Owner is authorized to promote or revoke OWNER credentials.");
        }
        
        User promoted = userService.changeUserRole(userId, role);
        
        ownerService.logAction(
            "User Promoted", 
            currentUser.getEmail() != null ? currentUser.getEmail() : currentUser.getPhone(), 
            "User " + promoted.getName() + " (ID: " + promoted.getId() + ") role changed to " + role
        );
        
        return ResponseEntity.ok(promoted);
    }

    @PostMapping("/users/block")
    public ResponseEntity<User> blockUser(
            @RequestParam Long userId,
            @RequestParam boolean blocked,
            @AuthenticationPrincipal UserDetails currentUserDetails) {
        
        User currentUser = userService.getUserByIdentifier(currentUserDetails.getUsername());
        
        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("Operation failed: You cannot block yourself.");
        }
        
        User updated = userService.setUserBlockedStatus(userId, blocked);
        
        ownerService.logAction(
            blocked ? "User Blocked" : "User Unblocked",
            currentUser.getEmail() != null ? currentUser.getEmail() : currentUser.getPhone(),
            "User " + updated.getName() + " (ID: " + updated.getId() + ") status set to blocked=" + blocked
        );
        
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs(@AuthenticationPrincipal UserDetails currentUserDetails) {
        User currentUser = userService.getUserByIdentifier(currentUserDetails.getUsername());
        if (!currentUser.isSuperOwner()) {
            throw new RuntimeException("Operation denied: Only the Super Owner can access administrative audit records.");
        }
        return ResponseEntity.ok(ownerService.getAllAuditLogs());
    }

    @PostMapping("/audit-logs/log")
    public ResponseEntity<Void> logAction(
            @RequestParam String actionName,
            @RequestParam String performedBy,
            @RequestParam String details) {
        ownerService.logAction(actionName, performedBy, details);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/settings")
    public ResponseEntity<Void> updateSettings(
            @RequestBody java.util.Map<String, String> settingsMap,
            @AuthenticationPrincipal UserDetails currentUserDetails) {
        
        User currentUser = userService.getUserByIdentifier(currentUserDetails.getUsername());
        if (!currentUser.isSuperOwner()) {
            throw new RuntimeException("Operation denied: Only the Super Owner can update global website parameters.");
        }
        
        for (java.util.Map.Entry<String, String> entry : settingsMap.entrySet()) {
            com.mediequip.marketplace.entity.WebsiteSetting setting = websiteSettingRepository.findById(entry.getKey())
                    .orElse(new com.mediequip.marketplace.entity.WebsiteSetting(entry.getKey(), entry.getValue()));
            setting.setValue(entry.getValue());
            websiteSettingRepository.save(setting);
        }
        
        ownerService.logAction("Settings Changed", currentUser.getEmail(), "Updated parameters: " + settingsMap.keySet());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, @AuthenticationPrincipal UserDetails currentUserDetails) {
        User currentUser = userService.getUserByIdentifier(currentUserDetails.getUsername());
        if (!currentUser.isSuperOwner()) {
            throw new RuntimeException("Operation denied: Only the Super Owner can delete user records.");
        }
        User targetUser = userService.getUserById(id);
        if (targetUser.isSuperOwner()) {
            throw new RuntimeException("Operation failed: Cannot delete a Super Owner account.");
        }
        userService.deleteUser(id);
        ownerService.logAction("User Deleted", currentUser.getEmail(), "Removed user ID: " + id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inventory/history")
    public ResponseEntity<List<com.mediequip.marketplace.entity.StockAdjustmentLog>> getStockHistory() {
        return ResponseEntity.ok(stockAdjustmentLogRepository.findAll());
    }

    @PostMapping("/inventory/adjust")
    public ResponseEntity<Void> adjustStock(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam String type,
            @RequestParam String reason,
            @AuthenticationPrincipal UserDetails currentUserDetails) {
        
        User currentUser = userService.getUserByIdentifier(currentUserDetails.getUsername());
        com.mediequip.marketplace.entity.Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        int oldStock = product.getStock();
        if ("INCREASE".equalsIgnoreCase(type)) {
            product.setStock(oldStock + quantity);
        } else if ("DECREASE".equalsIgnoreCase(type)) {
            product.setStock(Math.max(0, oldStock - quantity));
        } else if ("DAMAGE".equalsIgnoreCase(type)) {
            product.setDamagedStock(product.getDamagedStock() + quantity);
            product.setStock(Math.max(0, oldStock - quantity));
        } else if ("RETURN".equalsIgnoreCase(type)) {
            product.setReturnedStock(product.getReturnedStock() + quantity);
            product.setStock(oldStock + quantity);
        } else if ("INCOMING".equalsIgnoreCase(type)) {
            product.setIncomingStock(Math.max(0, product.getIncomingStock() - quantity));
            product.setStock(oldStock + quantity);
        } else if ("SET_INCOMING".equalsIgnoreCase(type)) {
            product.setIncomingStock(quantity);
        }
        
        productRepository.save(product);
        
        com.mediequip.marketplace.entity.StockAdjustmentLog log = com.mediequip.marketplace.entity.StockAdjustmentLog.builder()
                .productId(productId)
                .adjustmentType(type.toUpperCase())
                .quantityChanged(quantity)
                .reason(reason)
                .performedBy(currentUser.getEmail())
                .build();
        stockAdjustmentLogRepository.save(log);
        
        ownerService.logAction(
            "Stock Adjusted", 
            currentUser.getEmail(), 
            "Product " + product.getName() + " (ID: " + productId + ") adjusted: type=" + type + ", quantity=" + quantity + ", oldStock=" + oldStock + ", newStock=" + product.getStock()
        );
        
        return ResponseEntity.ok().build();
    }
}
