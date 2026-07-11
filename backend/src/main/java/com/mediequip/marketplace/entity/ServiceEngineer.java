package com.mediequip.marketplace.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "service_engineers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEngineer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Employee ID is required")
    @Size(max = 50)
    @Column(name = "employee_id", nullable = false, unique = true)
    private String employeeId;

    @NotBlank(message = "Full name is required")
    @Size(max = 200)
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100)
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(max = 15)
    @Column(nullable = false, unique = true)
    private String phone;

    @Size(max = 500)
    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Size(max = 1000)
    private String skills;

    @Size(max = 1000)
    private String certifications;

    @Min(value = 0, message = "Experience years cannot be negative")
    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "current_latitude")
    private Double currentLatitude;

    @Column(name = "current_longitude")
    private Double currentLongitude;

    @NotNull(message = "Availability status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(50)")
    private EngineerAvailability availability;

    @Min(value = 0)
    @Max(value = 5)
    private Double rating;

    @Column(name = "active_status")
    private Boolean activeStatus;

    @Version
    private Long version;
}
