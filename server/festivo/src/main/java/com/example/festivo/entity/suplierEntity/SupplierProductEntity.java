package com.example.festivo.entity.suplierEntity;

import java.math.BigDecimal;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "supplierProducts")
public class SupplierProductEntity {

    @Id
    private String id;

    @Indexed(unique = true)
    private String supplierEmail;
    private String productName;
    private BigDecimal price;
    private String quantity;
    private String description;
    private String imageUrl;

}
