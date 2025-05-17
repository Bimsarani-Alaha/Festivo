package com.example.festivo.dto.supplierPaymentDTO;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SupplierPaymentRequestDTO {

    private String supplierEmail;   
    
    private String productId;
    private String orderRequestId;         

    private BigDecimal amount;             
    private String paymentType;            
    private String paymentStatus;          

    private Date deliveryDate;
    private Date paymentDate; 

}
