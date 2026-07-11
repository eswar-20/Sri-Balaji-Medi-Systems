package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.CreateServiceRequestDTO;
import com.mediequip.marketplace.dto.CustomerFeedbackDTO;
import com.mediequip.marketplace.dto.ServiceRequestResponseDTO;
import com.mediequip.marketplace.entity.*;
import com.mediequip.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ServiceAuditService auditService;
    private final NotificationService notificationService;

    public ServiceRequestResponseDTO createRequest(CreateServiceRequestDTO dto, String customerEmail) {
        User user = userRepository.findByEmailOrPhone(customerEmail, customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer user not found"));

        Product product = null;
        if (dto.getProductId() != null) {
            product = productRepository.findById(dto.getProductId()).orElse(null);
        }

        ServiceRequest request = ServiceRequest.builder()
                .user(user)
                .product(product)
                .equipmentName(dto.getEquipmentName())
                .equipmentBrand(dto.getEquipmentBrand())
                .equipmentModel(dto.getEquipmentModel())
                .serialNumber(dto.getSerialNumber())
                .clinicHospitalName(dto.getClinicHospitalName())
                .contactPerson(dto.getContactPerson())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .serviceType(dto.getServiceType())
                .priority(dto.getPriority())
                .status(ServiceRequestStatus.PENDING)
                .description(dto.getDescription())
                .scheduledDate(dto.getScheduledDate())
                .preferredVisitTime(dto.getPreferredVisitTime())
                .estimatedDurationHours(2)
                .purchaseDate(dto.getPurchaseDate())
                .warrantyExpiry(dto.getWarrantyExpiry())
                .customerRemarks(dto.getCustomerRemarks())
                .build();

        ServiceRequest saved = requestRepository.save(request);

        // Audit Logging
        auditService.logAction(saved, ServiceAction.CREATED, "Service request initiated via client portal", customerEmail);

        // Notification Alerts
        if (dto.getPriority() == ServicePriority.EMERGENCY) {
            notificationService.sendSms(user.getPhone(), "[CRITICAL ALERT] Emergency Service request created for " + dto.getEquipmentName() + ". We are dispatching support.");
        } else {
            notificationService.sendNotification(user.getEmail(), user.getPhone(), "Service Request Created", 
                    "Your request for " + dto.getEquipmentName() + " is received. Reference ID: " + saved.getId());
        }

        return convertToDTO(saved);
    }

    public ServiceRequestResponseDTO updateRequestStatus(Long id, ServiceRequestStatus status, String notes, String performedBy) {
        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));

        ServiceRequestStatus oldStatus = request.getStatus();
        request.setStatus(status);
        request.setUpdatedAt(LocalDateTime.now());
        
        ServiceRequest saved = requestRepository.save(request);

        // Audit Log Action map
        ServiceAction action = mapStatusToAction(status);
        auditService.logAction(saved, action, notes, performedBy);

        // Notification
        notificationService.sendNotification(request.getUser().getEmail(), request.getUser().getPhone(), 
                "Service Request Status Update", 
                "Your request status changed from " + oldStatus + " to " + status);

        return convertToDTO(saved);
    }

    public void submitFeedback(Long id, CustomerFeedbackDTO feedbackDTO, String customerEmail) {
        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getUser().getEmail().equals(customerEmail) && !request.getUser().getPhone().equals(customerEmail)) {
            throw new RuntimeException("Unauthorized. This request does not belong to you.");
        }

        if (request.getStatus() != ServiceRequestStatus.COMPLETED) {
            throw new RuntimeException("Feedback can only be submitted for completed services");
        }

        String notes = String.format("Rating: %d/5. Would recommend: %b. Suggestions: %s", 
                feedbackDTO.getRating(), feedbackDTO.getWouldRecommend(), feedbackDTO.getSuggestions());

        auditService.logAction(request, ServiceAction.COMPLETED, "Feedback Submitted: " + notes, customerEmail);
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestResponseDTO> getRequestsForCustomer(String emailOrPhone) {
        User user = userRepository.findByEmailOrPhone(emailOrPhone, emailOrPhone)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestResponseDTO> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServiceRequestResponseDTO getRequestById(Long id) {
        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
        return convertToDTO(request);
    }

    private ServiceAction mapStatusToAction(ServiceRequestStatus status) {
        switch (status) {
            case ASSIGNED: return ServiceAction.ASSIGNED;
            case IN_PROGRESS: return ServiceAction.STARTED;
            case COMPLETED: return ServiceAction.COMPLETED;
            case CANCELLED: return ServiceAction.CANCELLED;
            default: return ServiceAction.STARTED;
        }
    }

    public ServiceRequestResponseDTO convertToDTO(ServiceRequest request) {
        return ServiceRequestResponseDTO.builder()
                .id(request.getId())
                .userId(request.getUser().getId())
                .userEmail(request.getUser().getEmail())
                .productId(request.getProduct() != null ? request.getProduct().getId() : null)
                .equipmentName(request.getEquipmentName())
                .equipmentBrand(request.getEquipmentBrand())
                .equipmentModel(request.getEquipmentModel())
                .serialNumber(request.getSerialNumber())
                .clinicHospitalName(request.getClinicHospitalName())
                .contactPerson(request.getContactPerson())
                .phone(request.getPhone())
                .address(request.getAddress())
                .serviceType(request.getServiceType())
                .priority(request.getPriority())
                .status(request.getStatus())
                .description(request.getDescription())
                .scheduledDate(request.getScheduledDate())
                .preferredVisitTime(request.getPreferredVisitTime())
                .estimatedDurationHours(request.getEstimatedDurationHours())
                .purchaseDate(request.getPurchaseDate())
                .warrantyExpiry(request.getWarrantyExpiry())
                .customerRemarks(request.getCustomerRemarks())
                .internalOwnerNotes(request.getInternalOwnerNotes())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .version(request.getVersion())
                .build();
    }
}
