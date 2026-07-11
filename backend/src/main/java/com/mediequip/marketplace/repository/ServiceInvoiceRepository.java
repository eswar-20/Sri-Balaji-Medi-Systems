package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.ServiceInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ServiceInvoiceRepository extends JpaRepository<ServiceInvoice, Long> {
    Optional<ServiceInvoice> findByServiceRequestId(Long serviceRequestId);
}
