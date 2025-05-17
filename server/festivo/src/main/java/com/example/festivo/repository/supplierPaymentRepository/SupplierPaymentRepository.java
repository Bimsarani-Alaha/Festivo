package com.example.festivo.repository.supplierPaymentRepository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.festivo.entity.supplierPaymentEntity.SupplierPaymentEntity;

public interface SupplierPaymentRepository extends MongoRepository<SupplierPaymentEntity, String> {
    // Find all payments by supplier email
    List<SupplierPaymentEntity> findBySupplierEmail(String supplierEmail);

    // Find all payments by order request ID
    List<SupplierPaymentEntity> findByOrderRequestId(String orderRequestId);

    List<SupplierPaymentEntity> findByProductId(String productId);

    // Find all payments by payment status
    List<SupplierPaymentEntity> findByPaymentStatus(String paymentStatus);

    // Find all payments by payment type
    List<SupplierPaymentEntity> findByPaymentType(String paymentType);

}
