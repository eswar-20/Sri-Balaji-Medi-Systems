package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.ServiceInvoiceDTO;
import com.mediequip.marketplace.entity.*;
import com.mediequip.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceInvoiceService {

    private final ServiceInvoiceRepository invoiceRepository;
    private final ServiceRequestRepository requestRepository;
    private final ServiceAssignmentRepository assignmentRepository;
    private final ServiceVisitRepository visitRepository;
    private final ServicePartUsageRepository partUsageRepository;
    private final ServiceAuditService auditService;

    public ServiceInvoiceDTO generateInvoice(Long requestId, BigDecimal laborCost, String performedBy) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Calculate parts cost
        BigDecimal partsCostTotal = BigDecimal.ZERO;
        
        ServiceAssignment assignment = assignmentRepository.findByServiceRequestId(requestId).orElse(null);
        if (assignment != null) {
            List<ServiceVisit> visits = visitRepository.findByAssignmentIdOrderByVisitNumberAsc(assignment.getId());
            for (ServiceVisit visit : visits) {
                List<ServicePartUsage> parts = partUsageRepository.findByVisitId(visit.getId());
                for (ServicePartUsage part : parts) {
                    if (part.getStatus() == ServicePartStatus.USED) {
                        BigDecimal itemCost = part.getUnitPrice().multiply(BigDecimal.valueOf(part.getQuantity()));
                        partsCostTotal = partsCostTotal.add(itemCost);
                    }
                }
            }
        }

        // Standard 18% GST tax calculation
        BigDecimal baseCost = partsCostTotal.add(laborCost);
        BigDecimal taxAmount = baseCost.multiply(BigDecimal.valueOf(0.18));
        BigDecimal totalAmount = baseCost.add(taxAmount);

        // Delete existing invoice if any
        invoiceRepository.findByServiceRequestId(requestId).ifPresent(invoiceRepository::delete);

        ServiceInvoice invoice = ServiceInvoice.builder()
                .serviceRequest(request)
                .partsCost(partsCostTotal)
                .laborCost(laborCost)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .invoiceStatus(InvoiceStatus.UNPAID)
                .build();

        ServiceInvoice saved = invoiceRepository.save(invoice);

        // Log Audit Log Action
        auditService.logAction(request, ServiceAction.INVOICE_GENERATED, 
                "Invoice generated for total amount: $" + totalAmount.toString(), performedBy);

        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public ServiceInvoiceDTO getInvoiceForRequest(Long requestId) {
        ServiceInvoice invoice = invoiceRepository.findByServiceRequestId(requestId)
                .orElseThrow(() -> new RuntimeException("Invoice not found for request: " + requestId));
        return convertToDTO(invoice);
    }

    public ServiceInvoiceDTO payInvoice(Long invoiceId) {
        ServiceInvoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        invoice.setInvoiceStatus(InvoiceStatus.PAID);
        ServiceInvoice saved = invoiceRepository.save(invoice);
        return convertToDTO(saved);
    }

    private ServiceInvoiceDTO convertToDTO(ServiceInvoice invoice) {
        return ServiceInvoiceDTO.builder()
                .id(invoice.getId())
                .serviceRequestId(invoice.getServiceRequest().getId())
                .partsCost(invoice.getPartsCost())
                .laborCost(invoice.getLaborCost())
                .taxAmount(invoice.getTaxAmount())
                .totalAmount(invoice.getTotalAmount())
                .invoiceStatus(invoice.getInvoiceStatus())
                .invoicePdfUrl(invoice.getInvoicePdfUrl())
                .build();
    }
}
