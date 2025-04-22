package com.example.festivo.controller.supplierOrders;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.festivo.dto.SupplierOrderRequestdto.SupplierReqDTO;
import com.example.festivo.dto.SupplierOrderRequestdto.SupplierResDTO;
import com.example.festivo.service.supplierOrderRequestService.SupplierOrderReqService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/public/supplierOrder")
@RequiredArgsConstructor
public class SupplierOrderReqController {

    private final SupplierOrderReqService supplierOrderRequestService;

    @PostMapping
    public ResponseEntity<SupplierResDTO> createSupplierOrder(
            @RequestBody SupplierReqDTO req) {
        SupplierResDTO res = supplierOrderRequestService.createSupplierOrder(req);
        if (res.getError() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        } else {
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        }
    }

}
