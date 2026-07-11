package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.ServiceAssignmentDTO;
import com.mediequip.marketplace.dto.ServiceEngineerDTO;
import com.mediequip.marketplace.dto.ServiceRequestResponseDTO;
import com.mediequip.marketplace.dto.ServiceVisitDTO;
import com.mediequip.marketplace.entity.ServicePartStatus;
import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.repository.ServiceAssignmentRepository;
import com.mediequip.marketplace.repository.UserRepository;
import com.mediequip.marketplace.service.ServiceEngineerService;
import com.mediequip.marketplace.service.ServiceRequestService;
import com.mediequip.marketplace.service.ServiceVisitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services/technician")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TECHNICIAN')")
@Tag(name = "Technician Services API", description = "Endpoints for technicians to track jobs, schedule visits, and allocate spare parts")
public class TechnicianServiceController {

    private final ServiceEngineerService engineerService;
    private final ServiceAssignmentRepository assignmentRepository;
    private final ServiceRequestService requestService;
    private final ServiceVisitService visitService;
    private final UserRepository userRepository;

    @GetMapping("/jobs")
    @Operation(summary = "List all active service jobs assigned to the authenticated technician")
    public ResponseEntity<List<ServiceRequestResponseDTO>> getAssignedJobs(Authentication auth) {
        User user = userRepository.findByEmailOrPhone(auth.getName(), auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceEngineerDTO engineer = engineerService.getByUserId(user.getId());
        List<ServiceRequestResponseDTO> jobs = assignmentRepository.findByEngineerId(engineer.getId()).stream()
                .map(a -> requestService.getRequestById(a.getServiceRequest().getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/assignments/{requestId}/visits")
    @Operation(summary = "Get all scheduled/completed visits for a specific service assignment ID")
    public ResponseEntity<List<ServiceVisitDTO>> getVisits(@PathVariable Long requestId) {
        ServiceAssignmentDTO assignment = assignmentRepository.findByServiceRequestId(requestId)
                .map(a -> ServiceAssignmentDTO.builder().id(a.getId()).build())
                .orElseThrow(() -> new RuntimeException("Assignment profile not found for request: " + requestId));
        List<ServiceVisitDTO> list = visitService.getVisitsForAssignment(assignment.getId());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/assignments/{requestId}/visits")
    @Operation(summary = "Create and record a new service visit (Diagnosis, Repair, etc.)")
    public ResponseEntity<ServiceVisitDTO> recordVisit(@PathVariable Long requestId, @Valid @RequestBody ServiceVisitDTO dto) {
        ServiceAssignmentDTO assignment = assignmentRepository.findByServiceRequestId(requestId)
                .map(a -> ServiceAssignmentDTO.builder().id(a.getId()).build())
                .orElseThrow(() -> new RuntimeException("Assignment profile not found"));
        ServiceVisitDTO resp = visitService.recordVisit(assignment.getId(), dto);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/visits/{visitId}/complete")
    @Operation(summary = "Upload final service reports, diagnostic photos, and mark visit as completed")
    public ResponseEntity<ServiceVisitDTO> completeVisit(@PathVariable Long visitId, @Valid @RequestBody ServiceVisitDTO dto) {
        ServiceVisitDTO resp = visitService.completeVisit(visitId, dto);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/visits/{visitId}/parts/reserve")
    @Operation(summary = "Reserve spare parts from catalog inventory for installation check")
    public ResponseEntity<Void> reservePart(@PathVariable Long visitId, @RequestParam Long productId, @RequestParam Integer quantity) {
        visitService.reserveSparePart(visitId, productId, quantity);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/parts-usages/{usageId}/status")
    @Operation(summary = "Update spare part usage status (Confirm USED or mark as RETURNED to restore stock)")
    public ResponseEntity<Void> updatePartStatus(@PathVariable Long usageId, @RequestParam ServicePartStatus status) {
        visitService.updatePartStatus(usageId, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/jobs/{id}")
    @Operation(summary = "Get details of a specific assigned service request")
    public ResponseEntity<ServiceRequestResponseDTO> getJobDetails(@PathVariable Long id, Authentication auth) {
        User user = userRepository.findByEmailOrPhone(auth.getName(), auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceEngineerDTO engineer = engineerService.getByUserId(user.getId());
        
        com.mediequip.marketplace.entity.ServiceAssignment assignment = assignmentRepository.findByServiceRequestId(id)
                .orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("Unauthorized. No assignment found for this job."));
        
        if (!assignment.getEngineer().getId().equals(engineer.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied. You are not assigned to this job.");
        }

        ServiceRequestResponseDTO resp = requestService.getRequestById(id);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/jobs/{id}/complete")
    @Operation(summary = "Mark request status as completed by the assigned technician")
    public ResponseEntity<ServiceRequestResponseDTO> completeJob(@PathVariable Long id, Authentication auth) {
        User user = userRepository.findByEmailOrPhone(auth.getName(), auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceEngineerDTO engineer = engineerService.getByUserId(user.getId());
        
        com.mediequip.marketplace.entity.ServiceAssignment assignment = assignmentRepository.findByServiceRequestId(id)
                .orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("Unauthorized. No assignment found for this job."));
        
        if (!assignment.getEngineer().getId().equals(engineer.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied. You are not assigned to this job.");
        }

        ServiceRequestResponseDTO resp = requestService.updateRequestStatus(id, com.mediequip.marketplace.entity.ServiceRequestStatus.COMPLETED, 
                "Job marked completed by Technician: " + engineer.getFullName(), auth.getName());
        return ResponseEntity.ok(resp);
    }
}
