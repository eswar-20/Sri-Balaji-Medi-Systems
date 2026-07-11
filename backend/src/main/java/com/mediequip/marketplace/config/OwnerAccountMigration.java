package com.mediequip.marketplace.config;

import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@Order(50)
@RequiredArgsConstructor
public class OwnerAccountMigration implements CommandLineRunner {

    private static final Set<String> OWNER_EMAILS = Set.of("sribalajimedisystemsofficial@gmail.com");
    private static final Set<String> OWNER_PHONES = Set.of("9948073090");

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        List<User> users = userRepository.findAll();
        boolean changed = false;

        for (User user : users) {
            boolean isOwnerAccount = (user.getEmail() != null && OWNER_EMAILS.contains(user.getEmail().toLowerCase()))
                    || (user.getPhone() != null && OWNER_PHONES.contains(user.getPhone()));

            if (isOwnerAccount && user.getRole() != User.Role.OWNER) {
                user.setRole(User.Role.OWNER);
                userRepository.save(user);
                changed = true;
            } else if (!isOwnerAccount && (user.getRole() == User.Role.ADMIN || user.getRole() == User.Role.OWNER)) {
                user.setRole(User.Role.USER);
                userRepository.save(user);
                changed = true;
            }
        }

        if (changed) {
            System.out.println("Owner account migration applied — only designated owner accounts have ROLE_OWNER");
        }
    }
}
