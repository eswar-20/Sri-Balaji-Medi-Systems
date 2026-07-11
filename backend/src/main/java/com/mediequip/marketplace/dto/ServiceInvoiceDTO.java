package com.mediequip.marketplace.dto;

import com.mediequip.marketplace.entity.InvoiceStatus;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceInvoiceDTO {
    private Long id;
    private Long serviceRequestId;
    private BigDecimal partsCost;
    private BigDecimal laborCost;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private InvoiceStatus invoiceStatus;
    private String invoicePdfUrl;
}
