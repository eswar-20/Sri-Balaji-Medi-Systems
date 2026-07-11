package com.mediequip.marketplace.dto;

import com.mediequip.marketplace.entity.AMCStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AMCContractDTO {
    private Long id;
    private Long userId;

    @NotBlank(message = "Equipment name is required")
    private String equipmentName;

    @NotBlank(message = "Equipment brand is required")
    private String equipmentBrand;

    @NotBlank(message = "Equipment model is required")
    private String equipmentModel;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private AMCStatus contractStatus;
    private Integer visitsPerYear;
    private Integer remainingVisits;
}
