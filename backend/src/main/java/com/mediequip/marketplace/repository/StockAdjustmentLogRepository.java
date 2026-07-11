package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.StockAdjustmentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StockAdjustmentLogRepository extends JpaRepository<StockAdjustmentLog, Long> {
    List<StockAdjustmentLog> findByProductId(Long productId);
}
