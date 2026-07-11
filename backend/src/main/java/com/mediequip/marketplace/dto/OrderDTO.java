package com.mediequip.marketplace.dto;

import com.mediequip.marketplace.entity.Order;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private String customerName;
    private String phone;
    private String address;
    private String city;
    private String pincode;
    private BigDecimal totalPrice;
    private Order.OrderStatus status;
    private List<OrderItemDTO> orderItems;
    private String userEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
