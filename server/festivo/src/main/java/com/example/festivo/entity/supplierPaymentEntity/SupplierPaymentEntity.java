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

    private String supplierEmail;
    
    private String productId;
    private String orderRequestId;         

    private BigDecimal amount;            
    private String paymentType;            
    private String paymentStatus;          

    private Date deliveryDate;
    private Date paymentDate; 
}
