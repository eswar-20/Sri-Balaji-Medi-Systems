package com.mediequip.marketplace.service;

import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user = userRepository.findByEmailOrPhone(identifier, identifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + identifier));

        if (user.isBlocked()) {
            throw new UsernameNotFoundException("This account is blocked by marketplace administrators.");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail() != null ? user.getEmail() : user.getPhone())
                .password("") // No password for OTP-based auth
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole())))
                .build();
    }

    public User createOrUpdateUser(String identifier, String name) {
        boolean isSuperOwnerEmail = "sribalajimedisystemsofficial@gmail.com".equalsIgnoreCase(identifier);

        return userRepository.findByEmailOrPhone(identifier, identifier)
                .map(user -> {
                    // Update existing user
                    if (user.getName() == null || user.getName().isEmpty()) {
                        user.setName(name);
                    }
                    if (isSuperOwnerEmail) {
                        user.setSuperOwner(true);
                        user.setRole(User.Role.OWNER);
                    }
                    return userRepository.save(user);
                })
                .orElseGet(() -> {
                    // Create new user
                    boolean isEmail = identifier.contains("@");
                    User newUser = User.builder()
                            .name(name)
                            .email(isEmail ? identifier : null)
                            .phone(isEmail ? null : identifier)
                            .role(isSuperOwnerEmail ? User.Role.OWNER : User.Role.USER)
                            .isSuperOwner(isSuperOwnerEmail)
                            .build();
                    return userRepository.save(newUser);
                });
    }

    public User getUserByIdentifier(String identifier) {
        return userRepository.findByEmailOrPhone(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @org.springframework.transaction.annotation.Transactional
    public User changeUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User.Role role = User.Role.valueOf(roleName.toUpperCase());
        user.setRole(role);
        return userRepository.save(user);
    }

    @org.springframework.transaction.annotation.Transactional
    public User setUserBlockedStatus(Long userId, boolean blocked) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(blocked);
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
