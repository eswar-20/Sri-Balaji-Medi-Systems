package com.mediequip.marketplace.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "service_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @NotBlank(message = "Equipment name is required")
    @Size(max = 200)
    @Column(name = "equipment_name", nullable = false)
    private String equipmentName;

    @NotBlank(message = "Equipment brand is required")
    @Size(max = 100)
    @Column(name = "equipment_brand", nullable = false)
    private String equipmentBrand;

    @NotBlank(message = "Equipment model is required")
    @Size(max = 100)
    @Column(name = "equipment_model", nullable = false)
    private String equipmentModel;

    @NotBlank(message = "Serial number is required")
    @Size(max = 100)
    @Column(name = "serial_number", nullable = false)
    private String serialNumber;

    @NotBlank(message = "Clinic or Hospital name is required")
    @Size(max = 200)
    @Column(name = "clinic_hospital_name", nullable = false)
    private String clinicHospitalName;

    @NotBlank(message = "Contact person is required")
    @Size(max = 200)
    @Column(name = "contact_person", nullable = false)
    private String contactPerson;

    @NotBlank(message = "Phone number is required")
    @Size(max = 15)
    @Column(nullable = false)
    private String phone;

    @NotBlank(message = "Clinic address is required")
    @Size(max = 500)
    @Column(nullable = false)
    private String address;

    @NotNull(message = "Service type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false, columnDefinition = "varchar(50)")
    private ServiceType serviceType;

    @NotNull(message = "Priority is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(50)")
    private ServicePriority priority;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(50)")
    private ServiceRequestStatus status;

    @NotBlank(message = "Problem description is required")
    @Size(max = 2000)
    @Column(nullable = false)
    private String description;

    @NotNull(message = "Scheduled visit date is required")
    @Column(name = "scheduled_date", nullable = false)
    private LocalDateTime scheduledDate;

    @NotBlank(message = "Preferred visit time window is required")
    @Size(max = 100)
    @Column(name = "preferred_visit_time", nullable = false)
    private String preferredVisitTime;

    @Column(name = "estimated_duration_hours")
    private Integer estimatedDurationHours;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "warranty_expiry")
    private LocalDate warrantyExpiry;

    @Size(max = 1000)
    @Column(name = "customer_remarks")
    private String customerRemarks;

    @Size(max = 1000)
    @Column(name = "internal_owner_notes")
    private String internalOwnerNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
