package com.mediequip.marketplace.repository;

import com.mediequip.marketplace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.mediequip.marketplace.entity.ProductType;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE p.deleted = false")
    List<Product> findAllActive();

    List<Product> findByName(String name);

    @Query("SELECT p FROM Product p WHERE p.category.name = :categoryName AND p.deleted = false")
    List<Product> findByCategoryNameActive(@Param("categoryName") String categoryName);
    
    @Query("SELECT p FROM Product p WHERE p.deleted = false AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> findByNameContainingIgnoreCaseActive(@Param("name") String name);

    @Query("SELECT p FROM Product p WHERE p.productType = :productType AND p.deleted = false")
    List<Product> findByProductTypeActive(@Param("productType") ProductType productType);

    @Query("SELECT p FROM Product p WHERE p.productType = :productType AND p.category.name = :categoryName AND p.deleted = false")
    List<Product> findByProductTypeAndCategoryNameActive(@Param("productType") ProductType productType, @Param("categoryName") String categoryName);

    @Query("SELECT p FROM Product p WHERE p.productType = :productType AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) AND p.deleted = false")
    List<Product> findByProductTypeAndNameContainingIgnoreCaseActive(@Param("productType") ProductType productType, @Param("name") String name);
    
    @Query("SELECT p FROM Product p WHERE p.stock > 0 AND p.enabled = true AND p.deleted = false")
    List<Product> findAvailableProducts();
    
    @Query("SELECT p FROM Product p WHERE p.category.name = :category AND p.stock > 0 AND p.enabled = true AND p.deleted = false")
    List<Product> findAvailableByCategory(@Param("category") String category);

}
