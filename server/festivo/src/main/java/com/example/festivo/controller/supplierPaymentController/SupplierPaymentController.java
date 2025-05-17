package com.example.festivo.controller.supplierPaymentController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<SupplierPaymentEntity>> getSupplierPaymentsByProductId(
            @PathVariable String productId) {
        List<SupplierPaymentEntity> payments = supplierPaymentService.getSupplierPaymentByProductId(productId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<SupplierPaymentEntity>> getSupplierPaymentsByOrderId(
            @PathVariable String orderId) {
        List<SupplierPaymentEntity> payments = supplierPaymentService.getSupplierPaymentBySupplierEmail(orderId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/supplier/{supplierEmail}")
    public ResponseEntity<List<SupplierPaymentEntity>> getSupplierPaymentsBySupplierEmail(
            @PathVariable String supplierEmail) {
        List<SupplierPaymentEntity> payments = supplierPaymentService.getSupplierPaymentBySupplierEmail(supplierEmail);
        return ResponseEntity.ok(payments);
    }

    @PostMapping
    public ResponseEntity<SupplierPaymentEntity> createSupplierPayment(
            @RequestBody SupplierPaymentRequestDTO supplierPaymentDTO) {
        SupplierPaymentEntity createdPayment = supplierPaymentService.createSupplierPayment(supplierPaymentDTO);
        return ResponseEntity.ok(createdPayment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplierPayment(
            @PathVariable String id,
            @RequestBody SupplierPaymentRequestDTO supplierPaymentDTO) {

        try {
            SupplierPaymentEntity updatedPayment = supplierPaymentService.updateSupplierPayment(id, supplierPaymentDTO);
            return ResponseEntity.ok(updatedPayment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}
