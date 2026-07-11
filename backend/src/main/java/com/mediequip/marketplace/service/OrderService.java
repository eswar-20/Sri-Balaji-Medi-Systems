package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.*;
import com.mediequip.marketplace.entity.*;
import com.mediequip.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersForUser(String identifier) {
        User user = userRepository.findByEmailOrPhone(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return convertToDTO(order);
    }
    
    public OrderDTO createOrder(OrderRequest orderRequest, String identifier) {
        User user = userRepository.findByEmailOrPhone(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("User not found with identifier: " + identifier));
        
        // Validate stock for all items
        for (CartItemDTO item : orderRequest.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
            
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                        ". Available: " + product.getStock() + ", Requested: " + item.getQuantity());
            }
        }
        
        // Calculate total price
        BigDecimal totalPrice = calculateTotalPrice(orderRequest.getItems());
        
        // Link user phone if not present
        if (orderRequest.getPhone() != null && (user.getPhone() == null || user.getPhone().isEmpty())) {
            user.setPhone(orderRequest.getPhone());
            userRepository.save(user);
        }

        // Create order
        Order order = Order.builder()
            .user(user)
            .customerName(orderRequest.getCustomerName())
            .phone(orderRequest.getPhone())
            .address(orderRequest.getAddress())
            .city(orderRequest.getCity())
            .pincode(orderRequest.getPincode())
            .totalPrice(totalPrice)
            .status(Order.OrderStatus.PENDING)
            .build();
        
        Order savedOrder = orderRepository.save(order);
        
        // Create order items and update stock
        for (CartItemDTO item : orderRequest.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
            
            // Create order item
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .productId(item.getProductId())
                    .quantity(item.getQuantity())
                    .price(product.getPrice())
                    .build();
            
            orderItemRepository.save(orderItem);
            
            // Update product stock
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }
        
        // Clear cart for this user
        List<CartItem> userCartItems = cartItemRepository.findByUserId(user.getId());
        cartItemRepository.deleteAll(userCartItems);
        
        return convertToDTO(savedOrder);
    }
    
    public OrderDTO updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        String oldStatus = order.getStatus().name();
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        logAdminAction("Order Status Changed", "Order ID: " + id + " status changed: " + oldStatus + " -> " + status.name());
        return convertToDTO(updatedOrder);
    }
    
    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        if (order.getStatus() == Order.OrderStatus.DELIVERED || order.getStatus() == Order.OrderStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed order");
        }
        
        // Restore stock for cancelled order
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(id);
        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
            
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
        logAdminAction("Order Status Changed", "Order ID: " + id + " status set to CANCELLED");
    }

    public OrderDTO returnOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        String oldStatus = order.getStatus().name();
        order.setStatus(Order.OrderStatus.RETURNED);
        Order updated = orderRepository.save(order);
        
        // Restore returned stock
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(id);
        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            product.setReturnedStock(product.getReturnedStock() + item.getQuantity());
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
        
        logAdminAction("Order Returned", "Order ID: " + id + " status set to RETURNED");
        return convertToDTO(updated);
    }

    public OrderDTO refundOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        String oldStatus = order.getStatus().name();
        order.setStatus(Order.OrderStatus.REFUNDED);
        order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
        Order updated = orderRepository.save(order);
        
        logAdminAction("Order Refunded", "Order ID: " + id + " status set to REFUNDED");
        return convertToDTO(updated);
    }

    private void logAdminAction(String actionName, String details) {
        try {
            org.springframework.security.core.Authentication auth = 
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String username = (auth != null) ? auth.getName() : "SYSTEM";
            auditLogRepository.save(AuditLog.builder()
                    .actionName(actionName)
                    .performedBy(username)
                    .details(details)
                    .build());
        } catch (Exception e) {
            System.err.println("Failed to log order audit action: " + e.getMessage());
        }
    }
    
    private BigDecimal calculateTotalPrice(List<CartItemDTO> items) {
        BigDecimal total = BigDecimal.ZERO;
        for (CartItemDTO item : items) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        return total;
    }
    
    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> orderItems = orderItemRepository.findByOrderId(order.getId()).stream()
                .map(this::convertOrderItemToDTO)
                .collect(Collectors.toList());
        
        return OrderDTO.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .address(order.getAddress())
                .city(order.getCity())
                .pincode(order.getPincode())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .orderItems(orderItems)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
    
    private OrderItemDTO convertOrderItemToDTO(OrderItem orderItem) {
        Product product = productRepository.findById(orderItem.getProductId()).orElse(null);
        return OrderItemDTO.builder()
                .id(orderItem.getId())
                .orderId(orderItem.getOrder().getId())
                .productId(orderItem.getProductId())
                .productName(product != null ? product.getName() : "Unknown Product")
                .productImageUrl(product != null ? product.getImageUrl() : "/api/placeholder/300/300")
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build();
    }
}
