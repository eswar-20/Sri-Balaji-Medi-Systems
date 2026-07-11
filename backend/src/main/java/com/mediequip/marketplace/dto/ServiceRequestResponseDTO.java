package com.mediequip.marketplace.dto;

import com.mediequip.marketplace.entity.ServiceType;
import com.mediequip.marketplace.entity.ServicePriority;
import com.mediequip.marketplace.entity.ServiceRequestStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequestResponseDTO {
    private Long id;
    private Long userId;
    private String userEmail;
    private Long productId;
    private String equipmentName;
    private String equipmentBrand;
    private String equipmentModel;
    private String serialNumber;
    private String clinicHospitalName;
    private String contactPerson;
    private String phone;
    private String address;
    private ServiceType serviceType;
    private ServicePriority priority;
    private ServiceRequestStatus status;
    private String description;
    private LocalDateTime scheduledDate;
    private String preferredVisitTime;
    private Integer estimatedDurationHours;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;
    private String customerRemarks;
    private String internalOwnerNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long version;
}
