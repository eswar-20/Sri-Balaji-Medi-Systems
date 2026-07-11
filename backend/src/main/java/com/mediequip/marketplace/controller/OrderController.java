package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.OrderDTO;
import com.mediequip.marketplace.dto.OrderRequest;
import com.mediequip.marketplace.entity.Order;
import com.mediequip.marketplace.service.OrderService;
import com.mediequip.marketplace.repository.OrderRepository;
import com.mediequip.marketplace.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    private final UserService userService;
    private final OrderRepository orderRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrdersForUser(authentication.getName()));
    }
    
    @GetMapping("/{id:\\d+}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id, Authentication authentication) {
        Order orderEntity = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        boolean isOwner = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_OWNER"));

        String principal = authentication.getName();
        String userEmail = orderEntity.getUser() != null ? orderEntity.getUser().getEmail() : null;
        String userPhone = orderEntity.getUser() != null ? orderEntity.getUser().getPhone() : null;

        if (!isOwner && !(principal.equals(userEmail) || principal.equals(userPhone))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderRequest orderRequest, Authentication authentication) {
        OrderDTO createdOrder = orderService.createOrder(orderRequest, authentication.getName());
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/return")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<OrderDTO> returnOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.returnOrder(id));
    }

    @PutMapping("/{id}/refund")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<OrderDTO> refundOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.refundOrder(id));
    }
}
