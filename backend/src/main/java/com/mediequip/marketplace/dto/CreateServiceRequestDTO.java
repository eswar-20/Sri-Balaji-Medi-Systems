package com.mediequip.marketplace.dto;

import com.mediequip.marketplace.entity.ServiceType;
import com.mediequip.marketplace.entity.ServicePriority;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateServiceRequestDTO {
    private Long productId;

    @NotBlank(message = "Equipment name is required")
    private String equipmentName;

    @NotBlank(message = "Equipment brand is required")
    private String equipmentBrand;

    @NotBlank(message = "Equipment model is required")
    private String equipmentModel;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotBlank(message = "Clinic or Hospital name is required")
    private String clinicHospitalName;

    @NotBlank(message = "Contact person is required")
    private String contactPerson;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone must be a valid number of 10 to 15 digits")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Service type is required")
    private ServiceType serviceType;

    @NotNull(message = "Priority is required")
    private ServicePriority priority;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Scheduled date is required")
    private LocalDateTime scheduledDate;

    @NotBlank(message = "Preferred visit window is required")
    private String preferredVisitTime;

    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;
    private String customerRemarks;
}
