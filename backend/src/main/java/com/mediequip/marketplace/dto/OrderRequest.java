package com.mediequip.marketplace.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^[0-9]{5,6}$", message = "Pincode must be 5-6 digits")
    private String pincode;
    
    @NotEmpty(message = "Order items cannot be empty")
    private List<CartItemDTO> items;
}
