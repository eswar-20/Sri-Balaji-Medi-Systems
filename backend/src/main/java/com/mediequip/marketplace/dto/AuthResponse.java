package com.mediequip.marketplace.dto;

import lombok.*;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    
    private boolean success;
    private String token;
    private String message;
    private Map<String, Object> user;
}
