package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.ServiceAssignmentDTO;
import com.mediequip.marketplace.entity.*;
import com.mediequip.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceAssignmentService {

    private final ServiceAssignmentRepository assignmentRepository;
    private final ServiceRequestRepository requestRepository;
    private final ServiceEngineerRepository engineerRepository;
    private final ServiceRequestService requestService;
    private final ServiceAuditService auditService;

    public ServiceAssignmentDTO assignEngineer(Long requestId, Long engineerId, String notes, String performedBy) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Service request not found"));

        ServiceEngineer engineer = engineerRepository.findById(engineerId)
                .orElseThrow(() -> new RuntimeException("Service engineer not found"));

        if (engineer.getAvailability() == EngineerAvailability.ON_LEAVE) {
            throw new RuntimeException("Engineer is on leave and cannot be assigned jobs");
        }

        // De-assign previous assignment if it exists
        assignmentRepository.findByServiceRequestId(requestId).ifPresent(assignmentRepository::delete);

        ServiceAssignment assignment = ServiceAssignment.builder()
                .serviceRequest(request)
                .engineer(engineer)
                .assignedAt(LocalDateTime.now())
                .notes(notes)
                .build();

        ServiceAssignment saved = assignmentRepository.save(assignment);

        // Update engineer availability status
        engineer.setAvailability(EngineerAvailability.BUSY);
        engineerRepository.save(engineer);

        // Update request status to ASSIGNED
        requestService.updateRequestStatus(requestId, ServiceRequestStatus.ASSIGNED, 
                "Technician " + engineer.getFullName() + " has been assigned to this request.", performedBy);

        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public ServiceAssignmentDTO getAssignmentForRequest(Long requestId) {
        ServiceAssignment assignment = assignmentRepository.findByServiceRequestId(requestId)
                .orElseThrow(() -> new RuntimeException("Assignment not found for request: " + requestId));
        return convertToDTO(assignment);
    }

    private ServiceAssignmentDTO convertToDTO(ServiceAssignment assignment) {
        return ServiceAssignmentDTO.builder()
                .id(assignment.getId())
                .serviceRequestId(assignment.getServiceRequest().getId())
                .engineerId(assignment.getEngineer().getId())
                .engineerName(assignment.getEngineer().getFullName())
                .assignedAt(assignment.getAssignedAt())
                .notes(assignment.getNotes())
                .build();
    }
}
