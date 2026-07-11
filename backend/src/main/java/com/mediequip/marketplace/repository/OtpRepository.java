package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    
    Optional<Otp> findByIdentifierAndIsUsedFalse(String identifier);
    
    @Query("SELECT o FROM Otp o WHERE o.identifier = :identifier AND o.isUsed = false AND o.expiryTime > :now ORDER BY o.createdAt DESC")
    Optional<Otp> findValidOtpByIdentifier(@Param("identifier") String identifier, @Param("now") LocalDateTime now);
    
    Optional<Otp> findFirstByIdentifierOrderByCreatedAtDesc(String identifier);
    
    void deleteAllByExpiryTimeBefore(LocalDateTime time);
    
    void deleteAllByIsUsedTrue();
}
