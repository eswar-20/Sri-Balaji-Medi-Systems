package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.AMCContractDTO;
import com.mediequip.marketplace.dto.CreateServiceRequestDTO;
import com.mediequip.marketplace.dto.CustomerFeedbackDTO;
import com.mediequip.marketplace.dto.ServiceRequestResponseDTO;
import com.mediequip.marketplace.dto.ServiceVisitDTO;
import com.mediequip.marketplace.dto.ServiceAssignmentDTO;
import com.mediequip.marketplace.service.AMCService;
import com.mediequip.marketplace.service.ServiceRequestService;
import com.mediequip.marketplace.service.ServiceAssignmentService;
import com.mediequip.marketplace.service.ServiceVisitService;
import com.mediequip.marketplace.service.ServiceAuditService;
import com.mediequip.marketplace.service.ServiceInvoiceService;
import com.mediequip.marketplace.repository.ServiceInvoiceRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/services/customer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
@Tag(name = "Customer Services API", description = "Endpoints for customer bookings, feedbacks, and AMC subscriptions")
public class CustomerServiceController {

    private final ServiceRequestService requestService;
    private final AMCService amcService;
    private final ServiceAssignmentService assignmentService;
    private final ServiceVisitService visitService;
    private final ServiceAuditService auditService;
    private final ServiceInvoiceService invoiceService;
    private final ServiceInvoiceRepository invoiceRepository;

    @PostMapping("/requests")
    @Operation(summary = "Create a new medical equipment service booking request")
    public ResponseEntity<ServiceRequestResponseDTO> createRequest(@Valid @RequestBody CreateServiceRequestDTO dto, Authentication auth) {
        ServiceRequestResponseDTO resp = requestService.createRequest(dto, auth.getName());
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }

    @GetMapping("/requests")
    @Operation(summary = "Get all service requests filed by the authenticated customer")
    public ResponseEntity<List<ServiceRequestResponseDTO>> getMyRequests(Authentication auth) {
        List<ServiceRequestResponseDTO> list = requestService.getRequestsForCustomer(auth.getName());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/requests/{id}")
    @Operation(summary = "Get specific details of a service request by ID")
    public ResponseEntity<ServiceRequestResponseDTO> getRequestDetails(@PathVariable Long id) {
        ServiceRequestResponseDTO resp = requestService.getRequestById(id);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/requests/{id}/feedback")
    @Operation(summary = "Submit diagnostic feedback rating and comments on completed jobs")
    public ResponseEntity<Void> submitFeedback(@PathVariable Long id, @Valid @RequestBody CustomerFeedbackDTO feedbackDTO, Authentication auth) {
        requestService.submitFeedback(id, feedbackDTO, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/amc/subscribe")
    @Operation(summary = "Purchase and register a new Annual Maintenance Contract (AMC)")
    public ResponseEntity<AMCContractDTO> subscribeAMC(@Valid @RequestBody AMCContractDTO dto, Authentication auth) {
        AMCContractDTO resp = amcService.subscribeAMC(dto, auth.getName());
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }

    @GetMapping("/amc/my-contracts")
    @Operation(summary = "Retrieve all active AMC subscriptions of the authenticated customer")
    public ResponseEntity<List<AMCContractDTO>> getMyContracts(Authentication auth) {
        List<AMCContractDTO> list = amcService.getContractsForCustomer(auth.getName());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/requests/{id}/visits")
    @Operation(summary = "Get visits list for a specific request")
    public ResponseEntity<List<ServiceVisitDTO>> getVisitsForRequest(@PathVariable Long id, Authentication auth) {
        checkRequestOwnership(id, auth);
        try {
            com.mediequip.marketplace.dto.ServiceAssignmentDTO assignment = assignmentService.getAssignmentForRequest(id);
            List<ServiceVisitDTO> visits = visitService.getVisitsForAssignment(assignment.getId());
            return ResponseEntity.ok(visits);
        } catch (Exception e) {
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    @GetMapping("/requests/{id}/assignment")
    @Operation(summary = "Get assignment details for a specific request")
    public ResponseEntity<ServiceAssignmentDTO> getAssignmentForRequest(@PathVariable Long id, Authentication auth) {
        checkRequestOwnership(id, auth);
        try {
            ServiceAssignmentDTO assignment = assignmentService.getAssignmentForRequest(id);
            return ResponseEntity.ok(assignment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/requests/{id}/audit-logs")
    @Operation(summary = "Get status audit log entries for a request")
    public ResponseEntity<List<com.mediequip.marketplace.entity.ServiceAuditLog>> getAuditLogsForRequest(@PathVariable Long id, Authentication auth) {
        checkRequestOwnership(id, auth);
        List<com.mediequip.marketplace.entity.ServiceAuditLog> logs = auditService.getLogsForRequest(id);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/invoices/{invoiceId}/pay")
    @Operation(summary = "Pay a service invoice")
    public ResponseEntity<com.mediequip.marketplace.dto.ServiceInvoiceDTO> payInvoice(@PathVariable Long invoiceId, Authentication auth) {
        // Verify invoice request ownership first
        com.mediequip.marketplace.entity.ServiceInvoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        checkRequestOwnership(invoice.getServiceRequest().getId(), auth);

        com.mediequip.marketplace.dto.ServiceInvoiceDTO resp = invoiceService.payInvoice(invoiceId);
        return ResponseEntity.ok(resp);
    }

    private void checkRequestOwnership(Long id, Authentication auth) {
        ServiceRequestResponseDTO request = requestService.getRequestById(id);
        if (!request.getUserEmail().equals(auth.getName())) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied. You do not own this service request.");
        }
    }
}
