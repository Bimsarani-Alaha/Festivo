package com.example.festivo.dto.supplierDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SupplierRequestDTO {

    private String supplierEmail;
    private String companyName;
    private String category;
    private String address;

}
