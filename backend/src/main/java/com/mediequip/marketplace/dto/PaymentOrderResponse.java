package com.mediequip.marketplace.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrderResponse {
    private String razorpayOrderId;
    private Long amount; // in paisa
    private String currency;
    private String keyId;
    private String status;
}
