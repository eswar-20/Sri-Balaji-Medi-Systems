package com.mediequip.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpRequest {
    
    @NotBlank(message = "Identifier is required")
    private String identifier; // email or phone

    private String password;
}
