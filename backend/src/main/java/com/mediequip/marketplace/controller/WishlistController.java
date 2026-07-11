package com.mediequip.marketplace.controller;

import com.mediequip.marketplace.dto.ProductDTO;
import com.mediequip.marketplace.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getWishlist(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getWishlist(authentication.getName()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ProductDTO> addToWishlist(@PathVariable Long productId, Authentication authentication) {
        return ResponseEntity.ok(wishlistService.addToWishlist(authentication.getName(), productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(@PathVariable Long productId, Authentication authentication) {
        wishlistService.removeFromWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }
}
