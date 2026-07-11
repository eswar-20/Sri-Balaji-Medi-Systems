package com.mediequip.marketplace.service;

import com.mediequip.marketplace.entity.ServiceAction;
import com.mediequip.marketplace.entity.ServiceAuditLog;
import com.mediequip.marketplace.entity.ServiceRequest;
import com.mediequip.marketplace.repository.ServiceAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceAuditService {

    private final ServiceAuditLogRepository auditLogRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(ServiceRequest request, ServiceAction action, String notes, String performedBy) {
        ServiceAuditLog log = ServiceAuditLog.builder()
                .serviceRequest(request)
                .action(action)
                .notes(notes)
                .performedBy(performedBy)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<ServiceAuditLog> getLogsForRequest(Long requestId) {
        return auditLogRepository.findByServiceRequestIdOrderByTimestampDesc(requestId);
    }
}
