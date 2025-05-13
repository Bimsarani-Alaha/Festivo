package com.example.festivo.service.supplierService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.festivo.dto.supplierDTO.SupplierRequestDTO;
import com.example.festivo.entity.suplierEntity.SupplierEntity;
import com.example.festivo.repository.supplierRepository.SupplierRepository;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public SupplierEntity createSupplier(SupplierRequestDTO supplierRequestDTO) {
        SupplierEntity supplier = new SupplierEntity();

        // Map the DTO fields to the SupplierEntity fields
        supplier.setSupplierEmail(supplierRequestDTO.getSupplierEmail());
        supplier.setCompanyName(supplierRequestDTO.getCompanyName());
        supplier.setCategory(supplierRequestDTO.getCategory());
        supplier.setAddress(supplierRequestDTO.getAddress());

        // Save the supplier to the database
        return supplierRepository.save(supplier);
    }

    public boolean checkEmail(String email) {
        return supplierRepository.findBySupplierEmail(email).isPresent();
    }

    public SupplierEntity getSupplierByEmail(String email) {
        return supplierRepository.findBySupplierEmail(email)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    public SupplierEntity updatedSupplierEntity(String email, SupplierRequestDTO supplierRequestDTO) {
        SupplierEntity supplier = supplierRepository.findBySupplierEmail(email)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        // Update the fields of the supplier entity with the values from the DTO
        supplier.setCompanyName(supplierRequestDTO.getCompanyName());
        supplier.setCategory(supplierRequestDTO.getCategory());
        supplier.setAddress(supplierRequestDTO.getAddress());

        // Save the updated supplier entity to the database
        return supplierRepository.save(supplier);
    }

    public void deleteSupplierEntity(String email) {
        supplierRepository.deleteBySupplierEmail(email);
    }

}
