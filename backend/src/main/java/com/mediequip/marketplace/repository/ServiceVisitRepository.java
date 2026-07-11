package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.ServiceVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceVisitRepository extends JpaRepository<ServiceVisit, Long> {
    List<ServiceVisit> findByAssignmentIdOrderByVisitNumberAsc(Long assignmentId);
}
