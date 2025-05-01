package com.example.festivo.repository.supplierProductRepository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.festivo.entity.suplierEntity.SupplierProductEntity;
import java.util.List;

public interface SupplierProductRepository extends MongoRepository<SupplierProductEntity, String> {

    // Find all products by supplier email
    List<SupplierProductEntity> findBySupplierEmail(String email);

    // Find products by name (case insensitive)
    List<SupplierProductEntity> findByProductNameIgnoreCase(String productName);

    // Find products within price range
    List<SupplierProductEntity> findByPriceBetween(double minPrice, double maxPrice);

    // Find products with quantity greater than specified value
    List<SupplierProductEntity> findByQuantityGreaterThan(int quantity);

    // Custom query to find products by name containing a string (case insensitive)
    List<SupplierProductEntity> findByProductNameContainingIgnoreCase(String namePart);

    // Custom query to find products by description containing a string
    List<SupplierProductEntity> findByDescriptionContaining(String searchTerm);

    // Delete all products for a specific supplier email
    void deleteBySupplierEmail(String email);
}