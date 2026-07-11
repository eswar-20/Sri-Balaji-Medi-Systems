package com.mediequip.marketplace.dto;

import com.mediequip.marketplace.entity.ServiceVisitStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceVisitDTO {
    private Long id;
    private Long assignmentId;

    @NotNull(message = "Visit number is required")
    private Integer visitNumber;

    @NotBlank(message = "Visit purpose is required")
    private String purpose;

    @NotNull(message = "Visit date is required")
    private LocalDateTime visitDate;

    @NotBlank(message = "Visit notes are required")
    private String notes;

    private String beforePhotoUrl;
    private String afterPhotoUrl;
    private String engineerReportUrl;
    private String customerSignatureUrl;
    private ServiceVisitStatus status;
}
