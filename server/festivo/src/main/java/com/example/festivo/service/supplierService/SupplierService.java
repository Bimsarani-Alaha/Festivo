package com.example.festivo.service.supplierService;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.festivo.entity.suplierEntity.SupplierEntity;
import com.example.festivo.repository.supplierRepository.SupplierRepository;

public class SupplierService {

     @Autowired
    private SupplierRepository supplierRepository;
    
    public SupplierEntity createSupplier(SupplierEntity supplier) {
        supplier.setCompanyName(null);
        return supplierRepository.save(supplier);
    }

}
