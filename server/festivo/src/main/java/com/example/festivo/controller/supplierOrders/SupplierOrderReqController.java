package com.example.festivo.controller.supplierOrders;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.festivo.dto.SupplierOrderRequestdto.SupplierReqDTO;
import com.example.festivo.dto.SupplierOrderRequestdto.SupplierResDTO;
import com.example.festivo.entity.supplierReqOrderEntity.SupplierReq;
import com.example.festivo.repository.supplierOrderReqRepository.SupplierOrderReqRepo;
import com.example.festivo.service.supplierOrderRequestService.SupplierOrderReqService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/public/supplierOrder")
@RequiredArgsConstructor
public class SupplierOrderReqController {

    private final SupplierOrderReqService supplierOrderRequestService;
    private final SupplierOrderReqRepo supplierOrderReqRepository;

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

    @GetMapping("/get-all")
    public List<SupplierReq> getAllSupplierOrders() {
        return supplierOrderRequestService.getAllSupplierOrder();
    }

    @GetMapping("/by-category/{category}")
    public ResponseEntity<SupplierResDTO> getSupplierOrdersByCategory(
            @PathVariable String category) {

        try {
            List<SupplierReq> orders = supplierOrderReqRepository.findBySupplierCategory(category);

            if (orders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new SupplierResDTO(null, "No orders found for category: " + category));
            }

            // Convert entities to DTOs
            List<SupplierReqDTO> responseDtos = orders.stream()
                    .map(order -> new SupplierReqDTO(
                            order.getEventName(),
                            order.getEventPackage(),
                            order.getEventTheme(),
                            order.getEventType(),
                            order.getNoOfGuest(),
                            order.getSpecialRequest(),
                            order.getEventDate(),
                            order.getEventId(),
                            order.getSupplierCategory(),
                            order.getStatus()))
                    .collect(Collectors.toList());

            // You might want to create a different response DTO for lists
            return ResponseEntity.ok()
                    .body(new SupplierResDTO("Found " + responseDtos.size() + " orders", null));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new SupplierResDTO(null, "Error fetching orders: " + e.getMessage()));
        }
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<SupplierReq> updateOrderStatus(
            @PathVariable String id,
            @RequestBody SupplierReqDTO req) {

        try {
            SupplierReq updatedOrder = supplierOrderRequestService.updateOrderStatus(id, req);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

}
