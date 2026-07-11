package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    java.util.List<Category> findByProductType(com.mediequip.marketplace.entity.ProductType productType);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT c FROM Category c WHERE EXISTS (SELECT p FROM Product p WHERE p.category = c)")
    java.util.List<Category> findActiveCategories();

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT c FROM Category c WHERE c.productType = :productType AND EXISTS (SELECT p FROM Product p WHERE p.category = c)")
    java.util.List<Category> findActiveCategoriesByProductType(@org.springframework.data.repository.query.Param("productType") com.mediequip.marketplace.entity.ProductType productType);
}
