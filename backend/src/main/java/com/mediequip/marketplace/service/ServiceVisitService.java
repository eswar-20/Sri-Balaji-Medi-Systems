package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.ServiceVisitDTO;
import com.mediequip.marketplace.entity.*;
import com.mediequip.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceVisitService {

    private final ServiceVisitRepository visitRepository;
    private final ServiceAssignmentRepository assignmentRepository;
    private final ServicePartUsageRepository partUsageRepository;
    private final ProductRepository productRepository;
    private final ServiceRequestRepository requestRepository;
    private final ServiceEngineerRepository engineerRepository;
    private final ServiceRequestService requestService;

    public ServiceVisitDTO recordVisit(Long assignmentId, ServiceVisitDTO dto) {
        ServiceAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment profile not found"));

        ServiceVisit visit = ServiceVisit.builder()
                .assignment(assignment)
                .visitNumber(dto.getVisitNumber())
                .purpose(dto.getPurpose())
                .visitDate(dto.getVisitDate())
                .notes(dto.getNotes())
                .beforePhotoUrl(dto.getBeforePhotoUrl())
                .afterPhotoUrl(dto.getAfterPhotoUrl())
                .engineerReportUrl(dto.getEngineerReportUrl())
                .customerSignatureUrl(dto.getCustomerSignatureUrl())
                .status(ServiceVisitStatus.IN_PROGRESS)
                .build();

        ServiceVisit saved = visitRepository.save(visit);

        // Update request status to IN_PROGRESS
        requestService.updateRequestStatus(assignment.getServiceRequest().getId(), 
                ServiceRequestStatus.IN_PROGRESS, 
                "Technician started visit #" + dto.getVisitNumber() + " (" + dto.getPurpose() + ").", 
                assignment.getEngineer().getEmail());

        return convertToDTO(saved);
    }

    public ServiceVisitDTO completeVisit(Long id, ServiceVisitDTO dto) {
        ServiceVisit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit record not found"));

        visit.setNotes(dto.getNotes());
        visit.setAfterPhotoUrl(dto.getAfterPhotoUrl());
        visit.setEngineerReportUrl(dto.getEngineerReportUrl());
        visit.setCustomerSignatureUrl(dto.getCustomerSignatureUrl());
        visit.setStatus(ServiceVisitStatus.COMPLETED);

        ServiceVisit saved = visitRepository.save(visit);
        ServiceAssignment assignment = visit.getAssignment();

        // Release engineer availability to AVAILABLE if this is the final completing visit
        ServiceEngineer engineer = assignment.getEngineer();
        engineer.setAvailability(EngineerAvailability.AVAILABLE);
        engineerRepository.save(engineer);

        return convertToDTO(saved);
    }

    public void reserveSparePart(Long visitId, Long productId, Integer quantity) {
        ServiceVisit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock in inventory for spare part: " + product.getName());
        }

        // Subtract quantity from inventory
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);

        // Create reserved parts record
        ServicePartUsage usage = ServicePartUsage.builder()
                .visit(visit)
                .product(product)
                .quantity(quantity)
                .unitPrice(product.getPrice())
                .status(ServicePartStatus.RESERVED)
                .build();

        partUsageRepository.save(usage);
    }

    public void updatePartStatus(Long usageId, ServicePartStatus status) {
        ServicePartUsage usage = partUsageRepository.findById(usageId)
                .orElseThrow(() -> new RuntimeException("Part usage record not found"));

        if (usage.getStatus() == ServicePartStatus.USED || usage.getStatus() == ServicePartStatus.RETURNED) {
            throw new RuntimeException("Cannot modify part usage that is already marked as USED or RETURNED");
        }

        Product product = usage.getProduct();

        if (status == ServicePartStatus.RETURNED) {
            // Restore inventory
            product.setStock(product.getStock() + usage.getQuantity());
            productRepository.save(product);
        }

        usage.setStatus(status);
        partUsageRepository.save(usage);
    }

    @Transactional(readOnly = true)
    public List<ServiceVisitDTO> getVisitsForAssignment(Long assignmentId) {
        return visitRepository.findByAssignmentIdOrderByVisitNumberAsc(assignmentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ServiceVisitDTO convertToDTO(ServiceVisit visit) {
        return ServiceVisitDTO.builder()
                .id(visit.getId())
                .assignmentId(visit.getAssignment().getId())
                .visitNumber(visit.getVisitNumber())
                .purpose(visit.getPurpose())
                .visitDate(visit.getVisitDate())
                .notes(visit.getNotes())
                .beforePhotoUrl(visit.getBeforePhotoUrl())
                .afterPhotoUrl(visit.getAfterPhotoUrl())
                .engineerReportUrl(visit.getEngineerReportUrl())
                .customerSignatureUrl(visit.getCustomerSignatureUrl())
                .status(visit.getStatus())
                .build();
    }
}
