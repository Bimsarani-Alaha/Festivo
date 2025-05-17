package com.example.festivo.entity.supplierReqOrderEntity;

import java.util.Date;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "supplierOrderRequests")
public class SupplierReq {

    @Indexed
    private String id;
    
    private String eventName;
    private String eventPackage;
    private String eventTheme;
    private String eventType;
    private Integer noOfGuest;
    private String specialRequest;
    private Date eventDate;
    private String eventId;
    private String supplierCategory;
    private String status;
    private String acceptedSupplier;

}
