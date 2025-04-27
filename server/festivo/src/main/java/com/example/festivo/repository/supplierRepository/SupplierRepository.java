package com.example.festivo.repository.supplierRepository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.festivo.entity.suplierEntity.SupplierEntity;

public interface SupplierRepository extends MongoRepository<SupplierEntity, String> {

}
