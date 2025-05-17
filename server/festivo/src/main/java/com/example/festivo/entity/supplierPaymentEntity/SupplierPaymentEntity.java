package com.example.festivo.entity.supplierPaymentEntity;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "supplierPayments")
public class SupplierPaymentEntity {

    @Id
    private String id;

    private String supplierEmail;          // Links to SupplierProductEntity
    private String orderRequestId;         // Links to SupplierReq.id

    private BigDecimal amount;             // Total amount for this request
    private String paymentType;            // e.g., "COD"
    private String paymentStatus;          // "pending", "paid"

    private Date deliveryDate;
    private Date paymentDate;              // Set when marked as paid
}
