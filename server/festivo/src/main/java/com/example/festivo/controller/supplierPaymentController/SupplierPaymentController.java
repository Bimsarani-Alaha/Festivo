package com.example.festivo.controller.supplierPaymentController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.festivo.dto.supplierPaymentDTO.SupplierPaymentRequestDTO;
import com.example.festivo.entity.supplierPaymentEntity.SupplierPaymentEntity;
import com.example.festivo.service.supplierPaymentService.SupplierPaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/supplier/supplier-payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5176")
public class SupplierPaymentController {

    private final SupplierPaymentService supplierPaymentService;

    @GetMapping
    public ResponseEntity<List<SupplierPaymentEntity>> getAllSupplierPayments() {
        List<SupplierPaymentEntity> payments = supplierPaymentService.getAllSupplierPayment();
        return ResponseEntity.ok(payments);
    }

    @PostMapping
    public ResponseEntity<SupplierPaymentEntity> createSupplierPayment(
            @RequestBody SupplierPaymentRequestDTO supplierPaymentDTO) {
        SupplierPaymentEntity createdPayment = supplierPaymentService.createSupplierPayment(supplierPaymentDTO);
        return ResponseEntity.ok(createdPayment);
    }

}
