package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.ServiceAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceAssignmentRepository extends JpaRepository<ServiceAssignment, Long> {
    Optional<ServiceAssignment> findByServiceRequestId(Long serviceRequestId);
    List<ServiceAssignment> findByEngineerId(Long engineerId);
}
