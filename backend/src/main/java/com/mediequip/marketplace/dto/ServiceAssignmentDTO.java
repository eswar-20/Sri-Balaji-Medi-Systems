package com.mediequip.marketplace.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceAssignmentDTO {
    private Long id;
    private Long serviceRequestId;
    private Long engineerId;
    private String engineerName;
    private LocalDateTime assignedAt;
    private String notes;
}
