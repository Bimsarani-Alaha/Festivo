package com.example.festivo.repository.supplierOrderReqRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.festivo.entity.supplierReqOrderEntity.SupplierReq;

public interface SupplierOrderReqRepo extends MongoRepository<SupplierReq, String> {
    List<SupplierReq> findBySupplierCategory(String supplierCategory);
    
    // Optional case-insensitive search
    List<SupplierReq> findBySupplierCategoryIgnoreCase(String supplierCategory);

    List<SupplierReq> findByStatus(String status);
    
    // Explicitly declare findById (already inherited from MongoRepository)
    Optional<SupplierReq> findById(String id);
}