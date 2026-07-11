package com.mediequip.marketplace.config;

import com.mediequip.marketplace.entity.*;
import com.mediequip.marketplace.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@Profile("dev")
@Slf4j
public class DemoDataSeeder {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ServiceEngineerRepository serviceEngineerRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void seedDemoData() {
        log.info("Checking dev demo telemetry data requirements...");

        // 1. Seed Super Admin and 10+ users (Customers, Techs, Owners)
        List<User> users = new ArrayList<>();
        
        User superOwner = userRepository.findByEmailOrPhone("sribalajimedisystemsofficial@gmail.com", "9948073090")
                .orElseGet(() -> userRepository.save(User.builder()
                        .name("Sri Balaji Super Admin")
                        .email("sribalajimedisystemsofficial@gmail.com")
                        .phone("9948073090")
                        .role(User.Role.OWNER)
                        .isSuperOwner(true)
                        .blocked(false)
                        .build()));
        
        users.add(superOwner);

        for (int i = 1; i <= 10; i++) {
            final int index = i;
            final String email = "demo" + index + "@mediequip.com";
            final String phone = "900000000" + index;
            final User.Role role = (index == 1 || index == 2) ? User.Role.TECHNICIAN : 
                                   (index == 3) ? User.Role.OWNER : User.Role.USER;
            final boolean blocked = (index == 9);

            Optional<User> existing = userRepository.findByEmail(email);
            if (existing.isEmpty()) {
                existing = userRepository.findByPhone(phone);
            }
            if (existing.isPresent()) {
                users.add(existing.get());
                continue;
            }

            try {
                User user = userRepository.save(User.builder()
                        .name("Demo User " + index)
                        .email(email)
                        .phone(phone)
                        .role(role)
                        .blocked(blocked)
                        .isSuperOwner(false)
                        .build());
                users.add(user);
            } catch (Exception e) {
                userRepository.findByEmail(email).ifPresent(users::add);
            }
        }

        // 2. Fetch some products
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            log.warn("No products found in DB. Seeding skipped.");
            return;
        }

        if (users.isEmpty()) {
            log.warn("No users found for demo seeding. Seeding skipped.");
            return;
        }

        // 3. Seed multiple orders in different states
        if (orderRepository.count() == 0) {
            log.info("Seeding demo orders...");
            Order.OrderStatus[] statuses = Order.OrderStatus.values();
            for (int i = 0; i < 8; i++) {
                User customer = users.get((4 + i) % users.size()); // safe indexing
                Product prod = products.get(i % products.size());

                Order order = Order.builder()
                        .user(customer)
                        .customerName(customer.getName())
                        .phone(customer.getPhone())
                        .address("Flat 10" + i + ", Balaji Towers")
                        .city("Vijayawada")
                        .pincode("520010")
                        .status(statuses[i % statuses.length])
                        .paymentMethod("RAZORPAY")
                        .paymentStatus(i % 2 == 0 ? Order.PaymentStatus.PAID : Order.PaymentStatus.PENDING)
                        .totalPrice(prod.getPrice().multiply(new BigDecimal(1)))
                        .build();

                Order savedOrder = orderRepository.save(order);

                // Order items
                OrderItem item = OrderItem.builder()
                        .order(savedOrder)
                        .productId(prod.getId())
                        .quantity(1)
                        .price(prod.getPrice())
                        .build();
                orderItemRepository.save(item);
            }
        }

        // 4. Seed service engineers
        if (serviceEngineerRepository.count() == 0) {
            log.info("Seeding demo service engineers...");
            for (int i = 0; i < 2; i++) {
                User techUser = users.get((1 + i) % users.size()); // tech accounts with safe indexing
                ServiceEngineer eng = ServiceEngineer.builder()
                        .user(techUser)
                        .fullName(techUser.getName())
                        .email(techUser.getEmail())
                        .phone(techUser.getPhone())
                        .employeeId("EMP" + techUser.getId())
                        .skills(i % 2 == 0 ? "Diagnostic Ultrasound" : "ECG Calibration")
                        .availability(EngineerAvailability.AVAILABLE)
                        .activeStatus(true)
                        .build();
                serviceEngineerRepository.save(eng);
            }
        }

        // 5. Seed service requests
        if (serviceRequestRepository.count() == 0) {
            log.info("Seeding demo service requests...");
            for (int i = 0; i < 3; i++) {
                User customer = users.get((4 + i) % users.size()); // safe indexing
                ServiceRequest req = ServiceRequest.builder()
                        .user(customer)
                        .clinicHospitalName("Apollo Clinic Vijayawada")
                        .address("M.G. Road, Vijayawada")
                        .contactPerson(customer.getName())
                        .phone(customer.getPhone())
                        .equipmentName("ECG Machine 12-Channel")
                        .equipmentBrand("Sri Balaji")
                        .equipmentModel("SB-200")
                        .serialNumber("SB-SN-998" + i)
                        .description("Paper feed jammed or calibration needed")
                        .serviceType(ServiceType.PREVENTIVE_MAINTENANCE)
                        .priority(ServicePriority.MEDIUM)
                        .status(ServiceRequestStatus.PENDING)
                        .scheduledDate(LocalDateTime.now().plusDays(2))
                        .preferredVisitTime("10:00 AM - 01:00 PM")
                        .build();
                serviceRequestRepository.save(req);
            }
        }

        // 6. Seed audit logs
        if (auditLogRepository.count() == 0) {
            log.info("Seeding demo audit logs...");
            for (int i = 0; i < 5; i++) {
                AuditLog logObj = AuditLog.builder()
                        .actionName("Demo Action " + i)
                        .performedBy("sribalajimedisystemsofficial@gmail.com")
                        .details("Automatic system simulation seed log number " + i)
                        .build();
                auditLogRepository.save(logObj);
            }
        }

        log.info("Dev demo telemetry seeding checks complete!");
    }
}
