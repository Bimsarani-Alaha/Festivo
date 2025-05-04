package com.example.festivo.service.supplierOrderRequestService;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.festivo.controller.supplierOrders.SupplierOrderRequestService;
import com.example.festivo.dto.SupplierOrderRequestdto.SupplierReqDTO;
import com.example.festivo.dto.SupplierOrderRequestdto.SupplierResDTO;
import com.example.festivo.entity.suplierEntity.SupplierEntity;
import com.example.festivo.entity.supplierReqOrderEntity.SupplierReq;
import com.example.festivo.repository.supplierOrderReqRepository.SupplierOrderReqRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SupplierOrderReqService {
    private final SupplierOrderReqRepo supplierOrderReqRepository;

    public SupplierResDTO createSupplierOrder(SupplierReqDTO req) {

        SupplierReq supplierReq = new SupplierReq();
        supplierReq.setEventName(req.getEventName());
        supplierReq.setStatus("Ongoing");
        supplierReq.setEventPackage(req.getEventPackage());
        supplierReq.setEventTheme(req.getEventTheme());
        supplierReq.setEventType(req.getEventType());
        supplierReq.setNoOfGuest(req.getNoOfGuest());
        supplierReq.setSpecialRequest(req.getSpecialRequest());
        supplierReq.setEventDate(req.getEventDate());
        supplierReq.setEventId(req.getEventId());
        supplierReq.setSupplierCategory(req.getSupplierCategory());

        SupplierReq saved = supplierOrderReqRepository.save(supplierReq);

        if (saved.getId() == null)
            return new SupplierResDTO(null, "System Error");

        return new SupplierResDTO("Event Saved Success", null);
    }

    public List<SupplierReq> getAllSupplierOrder() {
        return supplierOrderReqRepository.findAll();
    }

    public SupplierReq updateOrderStatus(String id, SupplierReqDTO req) {
        Optional<SupplierReq> optionalSupplierReq = supplierOrderReqRepository.findById(id);
    
        if (optionalSupplierReq.isPresent()) {
            SupplierReq supplierReq = optionalSupplierReq.get();
            
            // Update status (you can update other fields as needed)
            supplierReq.setStatus(req.getStatus());
    
            // Save the updated entity
            SupplierReq updatedSupplierReq = supplierOrderReqRepository.save(supplierReq);
            
            return updatedSupplierReq;
        } else {
            throw new RuntimeException("Supplier order with ID " + id + " not found");
        }
    }
    

}
