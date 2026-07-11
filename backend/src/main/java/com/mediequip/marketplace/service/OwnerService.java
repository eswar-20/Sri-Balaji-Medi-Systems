package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.OwnerDashboardDTO;
import com.mediequip.marketplace.dto.ProductDTO;
import com.mediequip.marketplace.entity.Order;
import com.mediequip.marketplace.entity.Product;
import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.repository.OrderRepository;
import com.mediequip.marketplace.repository.ProductRepository;
import com.mediequip.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediequip.marketplace.entity.AuditLog;
import com.mediequip.marketplace.repository.AuditLogRepository;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OwnerService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;
    private final AuditLogRepository auditLogRepository;

    public OwnerDashboardDTO getDashboard() {
        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();
        List<Product> lowStock = products.stream()
                .filter(p -> p.getStock() != null && p.getStock() <= LOW_STOCK_THRESHOLD)
                .collect(Collectors.toList());

        BigDecimal revenue = orders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.DELIVERED)
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> ordersByStatus = new HashMap<>();
        for (Order.OrderStatus status : Order.OrderStatus.values()) {
            ordersByStatus.put(status.name(), orders.stream().filter(o -> o.getStatus() == status).count());
        }

        long customerCount = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.USER)
                .count();

        List<ProductDTO> lowStockDtos = lowStock.stream()
                .limit(10)
                .map(p -> productService.getProductById(p.getId()))
                .collect(Collectors.toList());

        return OwnerDashboardDTO.builder()
                .totalOrders(orders.size())
                .pendingOrders(orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.PENDING).count())
                .completedOrders(orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.DELIVERED).count())
                .totalRevenue(revenue)
                .totalProducts(products.size())
                .lowStockCount(lowStock.size())
                .totalCustomers(customerCount)
                .lowStockProducts(lowStockDtos)
                .ordersByStatus(ordersByStatus)
                .revenueByMonth(new HashMap<>())
                .build();
    }

    public List<ProductDTO> getInventory() {
        return productRepository.findAll().stream()
                .map(p -> productService.getProductById(p.getId()))
                .collect(Collectors.toList());
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    @Transactional
    public void logAction(String actionName, String performedBy, String details) {
        AuditLog log = AuditLog.builder()
                .actionName(actionName)
                .performedBy(performedBy)
                .details(details)
                .build();
        auditLogRepository.save(log);
    }
}
