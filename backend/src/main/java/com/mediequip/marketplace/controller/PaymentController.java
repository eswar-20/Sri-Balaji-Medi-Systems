package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.PaymentOrderRequest;
import com.mediequip.marketplace.dto.PaymentOrderResponse;
import com.mediequip.marketplace.dto.PaymentVerificationRequest;
import com.mediequip.marketplace.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payments/razorpay")
@RequiredArgsConstructor
@Tag(name = "Payments Management", description = "Endpoints for initiating and verifying Razorpay payments")
@PreAuthorize("isAuthenticated()")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    @Operation(summary = "Create a unique Razorpay transaction order code")
    public ResponseEntity<PaymentOrderResponse> createOrder(
            @Valid @RequestBody PaymentOrderRequest request, 
            Authentication authentication) {
        String email = authentication.getName();
        PaymentOrderResponse response = paymentService.createOrder(request, email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-payment")
    @Operation(summary = "Verify HMAC-SHA256 signature returned by checkout scripts")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request, 
            Authentication authentication) {
        String email = authentication.getName();
        boolean verified = paymentService.verifyPayment(request, email);
        
        Map<String, Object> body = new HashMap<>();
        if (verified) {
            body.put("status", "SUCCESS");
            body.put("message", "Payment signature successfully verified and reference updated.");
            return ResponseEntity.ok(body);
        } else {
            body.put("status", "FAILED");
            body.put("message", "Payment signature validation failed.");
            return ResponseEntity.badRequest().body(body);
        }
    }
}
