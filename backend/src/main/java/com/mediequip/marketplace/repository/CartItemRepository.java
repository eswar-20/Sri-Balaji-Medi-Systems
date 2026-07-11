package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findByUserId(Long userId);
    
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);
    
    List<CartItem> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT c FROM CartItem c WHERE c.product.id = :productId")
    CartItem findByProductIdSingle(@Param("productId") Long productId);

}
