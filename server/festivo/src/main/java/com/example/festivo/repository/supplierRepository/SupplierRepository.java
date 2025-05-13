package com.example.festivo.repository.supplierRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.festivo.entity.suplierEntity.SupplierEntity;

public interface SupplierRepository extends MongoRepository<SupplierEntity, String> {
    Optional<SupplierEntity> findBySupplierEmail(String email);  // finds one supplier
    List<SupplierEntity> findAllBySupplierEmail(String email);   // finds all suppliers with this email
    List<SupplierEntity> findByCategory(String category);

    void deleteBySupplierEmail(String email);
}