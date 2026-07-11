package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.ServiceEngineer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ServiceEngineerRepository extends JpaRepository<ServiceEngineer, Long> {
    Optional<ServiceEngineer> findByUserId(Long userId);
    Optional<ServiceEngineer> findByEmployeeId(String employeeId);
    Optional<ServiceEngineer> findByEmail(String email);
}
