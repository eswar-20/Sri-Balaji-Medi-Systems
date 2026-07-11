package com.mediequip.marketplace.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_visits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private ServiceAssignment assignment;

    @NotNull(message = "Visit number is required")
    @Column(name = "visit_number", nullable = false)
    private Integer visitNumber;

    @NotBlank(message = "Visit purpose is required")
    @Size(max = 500)
    @Column(nullable = false)
    private String purpose;

    @NotNull(message = "Visit date is required")
    @Column(name = "visit_date", nullable = false)
    private LocalDateTime visitDate;

    @NotBlank(message = "Visit notes are required")
    @Size(max = 2000)
    @Column(nullable = false)
    private String notes;

    @Size(max = 500)
    @Column(name = "before_photo_url")
    private String beforePhotoUrl;

    @Size(max = 500)
    @Column(name = "after_photo_url")
    private String afterPhotoUrl;

    @Size(max = 500)
    @Column(name = "engineer_report_url")
    private String engineerReportUrl;

    @Size(max = 500)
    @Column(name = "customer_signature_url")
    private String customerSignatureUrl;

    @NotNull(message = "Visit status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(50)")
    private ServiceVisitStatus status;
}
