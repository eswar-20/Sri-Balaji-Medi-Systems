package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.AMCContractDTO;
import com.mediequip.marketplace.entity.AMCContract;
import com.mediequip.marketplace.entity.AMCStatus;
import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.repository.AMCContractRepository;
import com.mediequip.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AMCService {

    private final AMCContractRepository amcRepository;
    private final UserRepository userRepository;

    public AMCContractDTO subscribeAMC(AMCContractDTO dto, String customerEmail) {
        User user = userRepository.findByEmailOrPhone(customerEmail, customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        AMCContract contract = AMCContract.builder()
                .user(user)
                .equipmentName(dto.getEquipmentName())
                .equipmentBrand(dto.getEquipmentBrand())
                .equipmentModel(dto.getEquipmentModel())
                .serialNumber(dto.getSerialNumber())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .price(dto.getPrice())
                .contractStatus(AMCStatus.ACTIVE)
                .visitsPerYear(dto.getVisitsPerYear() != null ? dto.getVisitsPerYear() : 4)
                .remainingVisits(dto.getVisitsPerYear() != null ? dto.getVisitsPerYear() : 4)
                .build();

        AMCContract saved = amcRepository.save(contract);
        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<AMCContractDTO> getContractsForCustomer(String emailOrPhone) {
        User user = userRepository.findByEmailOrPhone(emailOrPhone, emailOrPhone)
                .orElseThrow(() -> new RuntimeException("User profile not found"));
        return amcRepository.findByUserId(user.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AMCContractDTO convertToDTO(AMCContract contract) {
        return AMCContractDTO.builder()
                .id(contract.getId())
                .userId(contract.getUser().getId())
                .equipmentName(contract.getEquipmentName())
                .equipmentBrand(contract.getEquipmentBrand())
                .equipmentModel(contract.getEquipmentModel())
                .serialNumber(contract.getSerialNumber())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .price(contract.getPrice())
                .contractStatus(contract.getContractStatus())
                .visitsPerYear(contract.getVisitsPerYear())
                .remainingVisits(contract.getRemainingVisits())
                .build();
    }
}
