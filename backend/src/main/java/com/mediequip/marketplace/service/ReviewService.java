package com.mediequip.marketplace.service;

import com.mediequip.marketplace.entity.Review;
import com.mediequip.marketplace.entity.User;
import com.mediequip.marketplace.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;

    public List<Map<String, Object>> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    public Map<String, Object> addReview(String identifier, Long productId, Integer rating, String comment) {
        User user = userService.getUserByIdentifier(identifier);
        Review review = Review.builder()
                .productId(productId)
                .user(user)
                .rating(rating)
                .comment(comment)
                .build();
        return toMap(reviewRepository.save(review));
    }

    private Map<String, Object> toMap(Review review) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", review.getId());
        map.put("productId", review.getProductId());
        map.put("userName", review.getUser().getName());
        map.put("rating", review.getRating());
        map.put("comment", review.getComment());
        map.put("createdAt", review.getCreatedAt());
        return map;
    }
}
