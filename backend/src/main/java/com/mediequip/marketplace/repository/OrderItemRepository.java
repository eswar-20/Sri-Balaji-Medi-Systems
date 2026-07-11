package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrderId(Long orderId);
    
    List<OrderItem> findByProductId(Long productId);
    
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId")
    List<OrderItem> findOrderItemsByOrderId(@Param("orderId") Long orderId);

    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.productId = :productId AND oi.order.status IN (com.mediequip.marketplace.entity.Order$OrderStatus.PENDING, com.mediequip.marketplace.entity.Order$OrderStatus.PROCESSING, com.mediequip.marketplace.entity.Order$OrderStatus.CONFIRMED, com.mediequip.marketplace.entity.Order$OrderStatus.PACKED, com.mediequip.marketplace.entity.Order$OrderStatus.READY_TO_SHIP, com.mediequip.marketplace.entity.Order$OrderStatus.SHIPPED, com.mediequip.marketplace.entity.Order$OrderStatus.OUT_FOR_DELIVERY)")
    int sumReservedQuantityByProductId(@Param("productId") Long productId);
}
