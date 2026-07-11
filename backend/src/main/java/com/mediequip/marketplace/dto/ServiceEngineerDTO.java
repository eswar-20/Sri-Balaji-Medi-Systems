package com.mediequip.marketplace.dto;

import com.mediequip.marketplace.entity.EngineerAvailability;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEngineerDTO {
    private Long id;
    private Long userId;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String profilePhotoUrl;
    private String skills;
    private String certifications;
    private Integer experienceYears;
    private Double currentLatitude;
    private Double currentLongitude;
    private EngineerAvailability availability;
    private Double rating;
    private Boolean activeStatus;
}
