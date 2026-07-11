package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.ProductDTO;
import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.entity.WishlistItem;
import com.mediequip.marketplace.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductService productService;
    private final UserService userService;

    public List<ProductDTO> getWishlist(String identifier) {
        User user = userService.getUserByIdentifier(identifier);
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(item -> productService.getProductById(item.getProductId()))
                .collect(Collectors.toList());
    }

    public ProductDTO addToWishlist(String identifier, Long productId) {
        User user = userService.getUserByIdentifier(identifier);
        if (!wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            wishlistRepository.save(WishlistItem.builder().user(user).productId(productId).build());
        }
        return productService.getProductById(productId);
    }

    public void removeFromWishlist(String identifier, Long productId) {
        User user = userService.getUserByIdentifier(identifier);
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }
}
