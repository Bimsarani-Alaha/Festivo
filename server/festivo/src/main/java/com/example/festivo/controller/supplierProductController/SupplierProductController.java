package com.example.festivo.controller.supplierProductController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.festivo.dto.SupplierOrderRequestdto.SupplierReqDTO;
import com.example.festivo.dto.supplierProductsDto.SupplierProductRequestDTO;
import com.example.festivo.entity.suplierEntity.SupplierProductEntity;
import com.example.festivo.entity.supplierReqOrderEntity.SupplierReq;
import com.example.festivo.service.supplierProductService.SupplierProductService;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/supplier")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5176")
public class SupplierProductController {

    private final SupplierProductService supplierProductService;

    @PostMapping("/create-product")
    public ResponseEntity<SupplierProductEntity> addSupplierProduct(@RequestBody SupplierProductRequestDTO productDTO) {
        SupplierProductEntity product = supplierProductService.addSupplierProduct(productDTO);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/products/{email}")
    public ResponseEntity<List<SupplierProductEntity>> getSupplierProducts(@PathVariable String email) {
        List<SupplierProductEntity> products = supplierProductService.getSupplierProducts(email);
        return ResponseEntity.ok(products);
    }


    @PutMapping("/update-product/{id}")
    public ResponseEntity<SupplierProductEntity> updateSupplierProduct(
            @PathVariable String id,
            @RequestBody SupplierProductRequestDTO productDTO) {
        SupplierProductEntity updatedProduct = supplierProductService.updateSupplierProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }



}