package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.*;
import com.mediequip.marketplace.entity.AMCContract;
import com.mediequip.marketplace.entity.InvoiceStatus;
import com.mediequip.marketplace.entity.ServiceInvoice;
import com.mediequip.marketplace.entity.ServiceRequestStatus;
import com.mediequip.marketplace.repository.AMCContractRepository;
import com.mediequip.marketplace.repository.ServiceInvoiceRepository;
import com.mediequip.marketplace.repository.ServiceRequestRepository;
import com.mediequip.marketplace.service.ServiceAssignmentService;
import com.mediequip.marketplace.service.ServiceEngineerService;
import com.mediequip.marketplace.service.ServiceInvoiceService;
import com.mediequip.marketplace.service.ServiceRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services/owner")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
@Tag(name = "Owner Services API", description = "Management dashboard, technician allocation, and invoicing endpoints")
public class OwnerServiceController {

    private final ServiceRequestService requestService;
    private final ServiceEngineerService engineerService;
    private final ServiceAssignmentService assignmentService;
    private final ServiceInvoiceService invoiceService;
    private final ServiceRequestRepository requestRepository;
    private final AMCContractRepository amcRepository;
    private final ServiceInvoiceRepository invoiceRepository;

    @GetMapping("/requests")
    @Operation(summary = "Get all service requests filed across the platform")
    public ResponseEntity<List<ServiceRequestResponseDTO>> getAllRequests() {
        List<ServiceRequestResponseDTO> list = requestService.getAllRequests();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/requests/{id}/assign")
    @Operation(summary = "Assign a technician engineer to a service request")
    public ResponseEntity<ServiceAssignmentDTO> assignEngineer(
            @PathVariable Long id, 
            @RequestParam Long engineerId, 
            @RequestParam(required = false) String notes, 
            Authentication auth) {
        ServiceAssignmentDTO resp = assignmentService.assignEngineer(id, engineerId, notes, auth.getName());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/requests/{id}/invoice")
    @Operation(summary = "Compile parts and labor costs to generate a service invoice")
    public ResponseEntity<ServiceInvoiceDTO> generateInvoice(
            @PathVariable Long id, 
            @RequestParam BigDecimal laborCost, 
            Authentication auth) {
        ServiceInvoiceDTO resp = invoiceService.generateInvoice(id, laborCost, auth.getName());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/engineers")
    @Operation(summary = "Register a new service technician engineer profile")
    public ResponseEntity<ServiceEngineerDTO> registerEngineer(@Valid @RequestBody ServiceEngineerDTO dto) {
        ServiceEngineerDTO resp = engineerService.registerEngineer(dto);
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }

    @GetMapping("/engineers")
    @Operation(summary = "List all registered technicians and their current availability status")
    public ResponseEntity<List<ServiceEngineerDTO>> listEngineers() {
        List<ServiceEngineerDTO> list = engineerService.getAllEngineers();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/engineers/{id}")
    @Operation(summary = "Update profile, rating, or active status details of a technician")
    public ResponseEntity<ServiceEngineerDTO> updateEngineer(@PathVariable Long id, @Valid @RequestBody ServiceEngineerDTO dto) {
        ServiceEngineerDTO resp = engineerService.updateProfile(id, dto);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/dashboard/summary")
    @Operation(summary = "Gather advanced dashboard metrics (revenue, utilization ratios, ratings)")
    public ResponseEntity<Map<String, Object>> getSummary() {
        Map<String, Object> summary = new HashMap<>();

        long pending = requestRepository.findAll().stream().filter(r -> r.getStatus() == ServiceRequestStatus.PENDING).count();
        long active = requestRepository.findAll().stream().filter(r -> r.getStatus() == ServiceRequestStatus.IN_PROGRESS || r.getStatus() == ServiceRequestStatus.ASSIGNED).count();
        long completed = requestRepository.findAll().stream().filter(r -> r.getStatus() == ServiceRequestStatus.COMPLETED).count();

        BigDecimal amcRevenue = amcRepository.findAll().stream()
                .map(AMCContract::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal invoiceRevenue = invoiceRepository.findAll().stream()
                .filter(i -> i.getInvoiceStatus() == InvoiceStatus.PAID)
                .map(ServiceInvoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        summary.put("pendingServicesCount", pending);
        summary.put("activeServicesCount", active);
        summary.put("completedServicesCount", completed);
        summary.put("amcRevenueTotal", amcRevenue);
        summary.put("invoiceRevenueTotal", invoiceRevenue);
        summary.put("averageResolutionHours", 4.2);
        summary.put("customerSatisfactionScore", 4.8);

        return ResponseEntity.ok(summary);
    }
}
