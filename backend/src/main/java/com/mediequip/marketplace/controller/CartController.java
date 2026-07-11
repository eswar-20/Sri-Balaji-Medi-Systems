package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.CartItemDTO;
import com.mediequip.marketplace.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    
    private final CartService cartService;
    
    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getAllCartItems(Authentication authentication) {
        List<CartItemDTO> cartItems = cartService.getCartItemsForUser(authentication.getName());
        return ResponseEntity.ok(cartItems);
    }
    
    @PostMapping("/add")
    public ResponseEntity<CartItemDTO> addToCart(@RequestParam Long productId, @RequestParam Integer quantity, Authentication authentication) {
        CartItemDTO cartItem = cartService.addToCart(authentication.getName(), productId, quantity);
        return ResponseEntity.ok(cartItem);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CartItemDTO> updateCartItem(@PathVariable Long id, @RequestParam Integer quantity, Authentication authentication) {
        CartItemDTO cartItem = cartService.updateCartItem(authentication.getName(), id, quantity);
        return ResponseEntity.ok(cartItem);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id, Authentication authentication) {
        cartService.removeFromCart(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
