package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.AMCContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AMCContractRepository extends JpaRepository<AMCContract, Long> {
    List<AMCContract> findByUserId(Long userId);
}
