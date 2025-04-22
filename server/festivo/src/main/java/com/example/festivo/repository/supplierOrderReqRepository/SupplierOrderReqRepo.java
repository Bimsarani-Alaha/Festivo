package com.example.festivo.repository.supplierOrderReqRepository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.festivo.entity.supplierReqOrderEntity.SupplierReq;

public interface SupplierOrderReqRepo extends MongoRepository<SupplierReq, String> {

}
