package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findAllByOrderByCreatedAtDesc();
    
    List<Order> findByCustomerNameContainingIgnoreCase(String customerName);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.phone = :phone")
    List<Order> findByPhone(@Param("phone") String phone);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByStatus(Order.OrderStatus status);
}
