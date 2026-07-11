package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.ServiceEngineerDTO;
import com.mediequip.marketplace.entity.EngineerAvailability;
import com.mediequip.marketplace.entity.ServiceEngineer;
import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.repository.ServiceEngineerRepository;
import com.mediequip.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceEngineerService {

    private final ServiceEngineerRepository engineerRepository;
    private final UserRepository userRepository;

    public ServiceEngineerDTO registerEngineer(ServiceEngineerDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Associated User profile not found with id: " + dto.getUserId()));

        ServiceEngineer engineer = ServiceEngineer.builder()
                .user(user)
                .employeeId(dto.getEmployeeId())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .profilePhotoUrl(dto.getProfilePhotoUrl())
                .skills(dto.getSkills())
                .certifications(dto.getCertifications())
                .experienceYears(dto.getExperienceYears() != null ? dto.getExperienceYears() : 0)
                .availability(dto.getAvailability() != null ? dto.getAvailability() : EngineerAvailability.AVAILABLE)
                .rating(5.0)
                .activeStatus(true)
                .build();

        ServiceEngineer saved = engineerRepository.save(engineer);
        return convertToDTO(saved);
    }

    public ServiceEngineerDTO updateProfile(Long id, ServiceEngineerDTO dto) {
        ServiceEngineer engineer = engineerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Engineer not found with id: " + id));

        engineer.setFullName(dto.getFullName());
        engineer.setEmail(dto.getEmail());
        engineer.setPhone(dto.getPhone());
        engineer.setProfilePhotoUrl(dto.getProfilePhotoUrl());
        engineer.setSkills(dto.getSkills());
        engineer.setCertifications(dto.getCertifications());
        engineer.setExperienceYears(dto.getExperienceYears());
        if (dto.getAvailability() != null) {
            engineer.setAvailability(dto.getAvailability());
        }
        if (dto.getActiveStatus() != null) {
            engineer.setActiveStatus(dto.getActiveStatus());
        }

        ServiceEngineer updated = engineerRepository.save(engineer);
        return convertToDTO(updated);
    }

    public void updateLocation(Long id, Double lat, Double lon) {
        ServiceEngineer engineer = engineerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Engineer not found with id: " + id));
        engineer.setCurrentLatitude(lat);
        engineer.setCurrentLongitude(lon);
        engineerRepository.save(engineer);
    }

    @Transactional(readOnly = true)
    public List<ServiceEngineerDTO> getAllEngineers() {
        return engineerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServiceEngineerDTO getByUserId(Long userId) {
        ServiceEngineer engineer = engineerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Engineer profile not found for user: " + userId));
        return convertToDTO(engineer);
    }

    public ServiceEngineerDTO convertToDTO(ServiceEngineer engineer) {
        return ServiceEngineerDTO.builder()
                .id(engineer.getId())
                .userId(engineer.getUser().getId())
                .employeeId(engineer.getEmployeeId())
                .fullName(engineer.getFullName())
                .email(engineer.getEmail())
                .phone(engineer.getPhone())
                .profilePhotoUrl(engineer.getProfilePhotoUrl())
                .skills(engineer.getSkills())
                .certifications(engineer.getCertifications())
                .experienceYears(engineer.getExperienceYears())
                .currentLatitude(engineer.getCurrentLatitude())
                .currentLongitude(engineer.getCurrentLongitude())
                .availability(engineer.getAvailability())
                .rating(engineer.getRating())
                .activeStatus(engineer.getActiveStatus())
                .build();
    }
}
