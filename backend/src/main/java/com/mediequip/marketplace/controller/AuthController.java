package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.AuthRequest;
import com.mediequip.marketplace.dto.AuthResponse;
import com.mediequip.marketplace.dto.OtpRequest;
import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.service.OtpService;
import com.mediequip.marketplace.service.UserService;
import com.mediequip.marketplace.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final OtpService otpService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody OtpRequest request) {
        otpService.sendOtp(request.getIdentifier(), request.getPassword());
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully");
        response.put("identifier", request.getIdentifier());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody AuthRequest request) {
        try {
            boolean isValid = otpService.verifyOtp(request.getIdentifier(), request.getOtp());
            
            if (!isValid) {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.builder()
                                .success(false)
                                .message("Invalid or expired OTP")
                                .build());
            }

            User user = userService.createOrUpdateUser(request.getIdentifier(), request.getName());
            
            if (user.isBlocked()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(AuthResponse.builder()
                                .success(false)
                                .message("Authentication failed: Your account has been suspended.")
                                .build());
            }
            
            // Generate JWT token
            String token = jwtUtil.generateToken(request.getIdentifier());

            return ResponseEntity.ok(AuthResponse.builder()
                    .success(true)
                    .token(token)
                    .user(mapToUserResponse(user))
                    .message("Authentication successful")
                    .build());

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .success(false)
                            .message("Authentication failed: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<Map<String, String>> resendOtp(@Valid @RequestBody OtpRequest request) {
        otpService.sendOtp(request.getIdentifier(), request.getPassword());
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP resent successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getProfile(org.springframework.security.core.Authentication authentication) {
        User user = userService.getUserByIdentifier(authentication.getName());
        if (user.isBlocked()) {
            throw new RuntimeException("Authentication failed: Your account is blocked.");
        }
        return ResponseEntity.ok(mapToUserResponse(user));
    }

    private Map<String, Object> mapToUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("name", user.getName());
        userResponse.put("email", user.getEmail());
        userResponse.put("phone", user.getPhone());
        userResponse.put("role", user.getRole());
        userResponse.put("isSuperOwner", user.isSuperOwner());
        userResponse.put("blocked", user.isBlocked());
        userResponse.put("address", "Rajahmundry, Andhra Pradesh");
        return userResponse;
    }
}
