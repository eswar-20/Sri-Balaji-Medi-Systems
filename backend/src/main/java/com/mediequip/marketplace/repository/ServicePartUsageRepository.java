package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.ServicePartUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServicePartUsageRepository extends JpaRepository<ServicePartUsage, Long> {
    List<ServicePartUsage> findByVisitId(Long visitId);
}
