package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.ServiceAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceAuditLogRepository extends JpaRepository<ServiceAuditLog, Long> {
    List<ServiceAuditLog> findByServiceRequestIdOrderByTimestampDesc(Long serviceRequestId);
}
