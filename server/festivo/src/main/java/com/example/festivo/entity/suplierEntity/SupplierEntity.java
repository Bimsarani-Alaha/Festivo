package com.example.festivo.entity.suplierEntity;


import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "suppliers")
public class SupplierEntity {

    @Indexed
    private String id;

    private String companyName;
    private String category;
    private String contactNumber;
    private String address;
}
