package com.mediequip.marketplace.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "amc_contracts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AMCContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

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

    @NotNull(message = "Start date is required")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Contract status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "contract_status", nullable = false, columnDefinition = "varchar(50)")
    private AMCStatus contractStatus;

    @Column(name = "visits_per_year")
    private Integer visitsPerYear;

    @Column(name = "remaining_visits")
    private Integer remainingVisits;
}
