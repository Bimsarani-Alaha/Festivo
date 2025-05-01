package com.example.festivo.dto.supplierProductsDto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SupplierProductRequestDTO {

    private String supplierEmail;
    private String productName;
    private BigDecimal price;
    private String quantity;
    private String description;
    private String imageUrl;

}
