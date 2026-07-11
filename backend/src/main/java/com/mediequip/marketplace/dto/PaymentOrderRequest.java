package com.mediequip.marketplace.dto;

import com.mediequip.marketplace.entity.PaymentReferenceType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrderRequest {

    @NotNull(message = "Reference type is required")
    private PaymentReferenceType referenceType;

    @NotNull(message = "Reference ID is required")
    private Long referenceId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @Builder.Default
    private String currency = "INR";
}
