package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.CartItemDTO;
import com.mediequip.marketplace.entity.CartItem;
import com.mediequip.marketplace.entity.Product;
import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.repository.CartItemRepository;
import com.mediequip.marketplace.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {
    
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    
    public List<CartItemDTO> getCartItemsForUser(String identifier) {
        User user = userService.getUserByIdentifier(identifier);
        return cartItemRepository.findByUserId(user.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public CartItemDTO addToCart(String identifier, Long productId, Integer quantity) {
        User user = userService.getUserByIdentifier(identifier);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
        }
        
        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserIdAndProductId(user.getId(), productId);
        
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + quantity;
            if (product.getStock() < newQuantity) {
                throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
            }
            existingItem.setQuantity(newQuantity);
            CartItem updatedItem = cartItemRepository.save(existingItem);
            return convertToDTO(updatedItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(quantity)
                    .build();
            CartItem savedItem = cartItemRepository.save(cartItem);
            return convertToDTO(savedItem);
        }
    }
    
    public CartItemDTO updateCartItem(String identifier, Long id, Integer quantity) {
        User user = userService.getUserByIdentifier(identifier);
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + id));
        
        // Security check: verify ownership
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied. You do not own this cart item.");
        }
        
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        
        Product product = productRepository.findById(cartItem.getProduct() != null ? cartItem.getProduct().getId() : null)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
        }
        
        cartItem.setQuantity(quantity);
        CartItem updatedItem = cartItemRepository.save(cartItem);
        return convertToDTO(updatedItem);
    }
    
    public void removeFromCart(String identifier, Long id) {
        User user = userService.getUserByIdentifier(identifier);
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + id));
        
        // Security check: verify ownership
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied. You do not own this cart item.");
        }
        
        cartItemRepository.delete(cartItem);
    }
    
    public void clearCart(String identifier) {
        User user = userService.getUserByIdentifier(identifier);
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());
        cartItemRepository.deleteAll(items);
    }
    
    private CartItemDTO convertToDTO(CartItem cartItem) {
        Product product = cartItem.getProduct();
        return CartItemDTO.builder()
                .id(cartItem.getId())
                .productId(product != null ? product.getId() : null)
                .productName(product != null ? product.getName() : null)
                .productCategory(product != null && product.getCategory() != null ? product.getCategory().getName() : null)
                .productPrice(product != null ? product.getPrice() : null)
                .productStock(product != null ? product.getStock() : 0)
                .productImageUrl(product != null ? product.getImageUrl() : null)
                .quantity(cartItem.getQuantity())
                .createdAt(cartItem.getCreatedAt())
                .updatedAt(cartItem.getUpdatedAt())
                .build();
    }
}
