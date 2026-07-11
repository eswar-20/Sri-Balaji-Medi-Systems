package com.mediequip.marketplace.config;

import com.mediequip.marketplace.entity.Category;
import com.mediequip.marketplace.entity.Product;
import com.mediequip.marketplace.entity.ProductType;
import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.repository.CategoryRepository;
import com.mediequip.marketplace.repository.ProductRepository;
import com.mediequip.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initializeAdmin();
        }
        if (productRepository.count() <= 8) {
            initializeProducts();
        }
    }
    
    private void initializeAdmin() {
        User admin = User.builder()
                .name("Admin User")
                .email("sribalajimedisystemsofficial@gmail.com")
                .phone("9948073090")
                .role(User.Role.OWNER)
                .isSuperOwner(true)
                .build();

        userRepository.save(admin);
        System.out.println("Owner account created: sribalajimedisystemsofficial@gmail.com / 9948073090");
    }

    private void initializeDemoUser() {
        if (!userRepository.existsByPhone("9999999999") && !userRepository.existsByEmail("user@example.com")) {
            User user = User.builder()
                    .name("Demo User")
                    .email("user@example.com")
                    .phone("9999999999")
                    .role(User.Role.USER)
                    .build();
            userRepository.save(user);
            System.out.println("Demo user created: user@example.com / 9999999999");
        }
    }
    
    private void initProduct(String name, String categoryName, String price, int stock, String description, String imageUrl) {
        Category category = categoryRepository.findByName(categoryName)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(categoryName)
                        .productType(ProductType.EQUIPMENT)
                        .build()));
        
        productRepository.save(Product.builder()
                .name(name)
                .category(category)
                .productType(category.getProductType())
                .price(new BigDecimal(price))
                .stock(stock)
                .description(description)
                .imageUrl(imageUrl)
                .build());
    }

    private void initializeProducts() {
        // ECG Machines
        initProduct("CardioCare 12-Lead ECG Machine", "ECG Machines", "3299.99", 8, 
                "Professional-grade ECG machine with wireless connectivity and advanced arrhythmia detection.", 
                "/images/products/ecg-machines/cardiocare-12-lead-ecg.jpg");
        
        initProduct("CardioLite Portable ECG", "ECG Machines", "899.99", 20, 
                "Compact handheld ECG device for quick cardiac assessments and monitoring.", 
                "/api/placeholder/300/300");
        
        // Pulse Oximeters
        initProduct("PulsePro 5000 Oximeter", "Pulse Oximeters", "189.99", 15, 
                "High-precision pulse oximeter with continuous monitoring and alarms.", 
                "/api/placeholder/300/300");
        
        initProduct("PulseCheck Fingertip Oximeter", "Pulse Oximeters", "49.99", 50, 
                "Compact fingertip pulse oximeter for spot-checking oxygen saturation levels.", 
                "/api/placeholder/300/300");
        
        // Patient Monitors
        initProduct("VitaGuard Multi-Parameter Monitor", "Patient Monitors", "4599.99", 5, 
                "Comprehensive patient monitoring with ECG, SpO2, NIBP, and temperature tracking.", 
                "/api/placeholder/300/300");
        
        // OT Lights
        initProduct("SurgiBright LED OT Light", "OT Lights", "2899.99", 3, 
                "Shadow-free surgical lighting with adjustable intensity and color temperature.", 
                "/api/placeholder/300/300");
        
        // Oxygen Concentrators
        initProduct("OxyMax 10L Oxygen Concentrator", "Oxygen Concentrators", "1299.99", 12, 
                "High-flow oxygen concentrator with molecular sieve technology for continuous oxygen supply.", 
                "/api/placeholder/300/300");
        
        // Infusion Pumps
        initProduct("InfuSure Precision Pump", "Infusion Pumps", "2199.99", 7, 
                "Programmable infusion pump with drug library and dose error reduction system.", 
                "/api/placeholder/300/300");
        
        // Additional ECG Machines
        initProduct("CardioMax 3000 Holter Monitor", "ECG Machines", "4599.99", 6, 
                "24-hour Holter monitor with advanced arrhythmia detection and wireless transmission.", 
                "/api/placeholder/300/300");
        
        initProduct("CardioJunior Pediatric ECG", "ECG Machines", "1599.99", 12, 
                "Pediatric ECG machine with child-sized electrodes and gentle monitoring.", 
                "/api/placeholder/300/300");
        
        // Additional Pulse Oximeters
        initProduct("PulseElite Wrist Oximeter", "Pulse Oximeters", "129.99", 25, 
                "Wrist-worn pulse oximeter with continuous monitoring and sleep tracking.", 
                "/api/placeholder/300/300");
        
        initProduct("PulseBaby Infant Monitor", "Pulse Oximeters", "199.99", 18, 
                "Infant pulse oximeter with apnea alarm and temperature monitoring.", 
                "/api/placeholder/300/300");
        
        // Additional Patient Monitors
        initProduct("VitaLife ICU Monitor", "Patient Monitors", "8999.99", 3, 
                "Advanced ICU monitoring system with invasive and non-invasive parameters.", 
                "/api/placeholder/300/300");
        
        initProduct("VitaCare Bedside Monitor", "Patient Monitors", "3299.99", 10, 
                "Compact bedside monitor with vital signs display and trend analysis.", 
                "/api/placeholder/300/300");
        
        // Additional OT Lights
        initProduct("SurgiPro Mobile OT Light", "OT Lights", "1899.99", 8, 
                "Mobile surgical light with battery backup and adjustable focus.", 
                "/api/placeholder/300/300");
        
        initProduct("SurgiMini Exam Light", "OT Lights", "899.99", 15, 
                "Compact examination light for minor procedures and consultations.", 
                "/api/placeholder/300/300");
        
        // Additional Oxygen Concentrators
        initProduct("OxyHome 5L Concentrator", "Oxygen Concentrators", "799.99", 20, 
                "Home-use oxygen concentrator with quiet operation and energy efficiency.", 
                "/api/placeholder/300/300");
        
        initProduct("OxyTravel Portable Concentrator", "Oxygen Concentrators", "2499.99", 9, 
                "Portable oxygen concentrator with battery power and travel case.", 
                "/api/placeholder/300/300");
        
        // Additional Infusion Pumps
        initProduct("InfuSafe Syringe Pump", "Infusion Pumps", "1299.99", 14, 
                "Syringe infusion pump with precise flow control and safety features.", 
                "/api/placeholder/300/300");
        
        initProduct("InfuMini Ambulatory Pump", "Infusion Pumps", "899.99", 16, 
                "Lightweight ambulatory infusion pump for mobile patients.", 
                "/api/placeholder/300/300");
        
        // New Categories - Surgical Instruments
        initProduct("SurgiPrecision Surgical Kit", "Surgical Instruments", "599.99", 25, 
                "Complete surgical instrument set with sterilization case and organization.", 
                "/api/placeholder/300/300");
        
        initProduct("SurgiStainless Scissors Set", "Surgical Instruments", "299.99", 30, 
                "Medical-grade stainless steel scissors set for various surgical procedures.", 
                "/api/placeholder/300/300");
        
        // New Categories - Diagnostic Equipment
        initProduct("DiagnoLab Blood Analyzer", "Diagnostic Equipment", "12999.99", 4, 
                "Automated blood analyzer with comprehensive test panels and rapid results.", 
                "/api/placeholder/300/300");
        
        initProduct("DiagnoPortable Ultrasound", "Diagnostic Equipment", "8999.99", 7, 
                "Portable ultrasound machine with multiple probes and imaging modes.", 
                "/api/placeholder/300/300");
        
        // New Categories - Hospital Furniture
        initProduct("MediCare Hospital Bed", "Hospital Furniture", "3999.99", 8, 
                "Electric hospital bed with adjustable positions and side rails.", 
                "/api/placeholder/300/300");
        
        initProduct("MediComfort Ward Bed", "Hospital Furniture", "2499.99", 12, 
                "Manual ward bed with mattress and IV pole attachment.", 
                "/api/placeholder/300/300");
        
        // New Categories - Medical Disposables
        initProduct("SafeGloves Medical Gloves", "Medical Disposables", "29.99", 100, 
                "Powder-free medical examination gloves - box of 100.", 
                "/api/placeholder/300/300");
        
        initProduct("SafeMask Surgical Masks", "Medical Disposables", "19.99", 200, 
                "3-ply surgical masks with comfortable ear loops - box of 50.", 
                "/api/placeholder/300/300");
    }
}
