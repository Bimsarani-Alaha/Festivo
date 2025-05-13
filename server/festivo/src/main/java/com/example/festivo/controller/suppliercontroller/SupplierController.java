package com.example.festivo.controller.suppliercontroller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.festivo.dto.supplierDTO.SupplierRequestDTO;
import com.example.festivo.entity.suplierEntity.SupplierEntity;
import com.example.festivo.service.supplierService.SupplierService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/supplier")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5176")
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping("/get-supplier/{email}")
    public ResponseEntity<SupplierEntity> getSupplierDetails(@PathVariable String email) {
        SupplierEntity supplier = supplierService.getSupplierByEmail(email);
        return ResponseEntity.ok(supplier);
    }

    @PostMapping("/create")
    public ResponseEntity<SupplierEntity> createSupplier(@RequestBody SupplierRequestDTO req) {
        SupplierEntity createdSupplier = supplierService.createSupplier(req);
        return ResponseEntity.ok(createdSupplier);
    }

    @GetMapping("/checkEmail/{email}")
    public ResponseEntity<Boolean> checkEmail(@PathVariable String email) {
        boolean exists = supplierService.checkEmail(email);
        return ResponseEntity.ok(exists);
    }

    @PutMapping("/update-supplier/{email}")
    public ResponseEntity<SupplierEntity> updateSupplier(
            @PathVariable String email,
            @RequestBody SupplierRequestDTO productDTO) {
        SupplierEntity updatedSupplierEntity = supplierService.updatedSupplierEntity(email, productDTO);
        return ResponseEntity.ok(updatedSupplierEntity);
    }

    @DeleteMapping("/delete-supplier/{email}")
    public ResponseEntity<String> deleteSupplier(@PathVariable String email) {
        supplierService.deleteSupplierEntity(email);
        return ResponseEntity.ok("Account deleted successfully");
    }

}
