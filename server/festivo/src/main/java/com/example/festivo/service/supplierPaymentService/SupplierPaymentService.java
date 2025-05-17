package com.example.festivo.service.supplierPaymentService;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.festivo.dto.supplierPaymentDTO.SupplierPaymentRequestDTO;
import com.example.festivo.entity.supplierPaymentEntity.SupplierPaymentEntity;
import com.example.festivo.repository.supplierPaymentRepository.SupplierPaymentRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SupplierPaymentService {

    
    private final SupplierPaymentRepository supplierPaymentRepository;

    public List<SupplierPaymentEntity> getAllSupplierPayment(){
        return supplierPaymentRepository.findAll();
    }

    public SupplierPaymentEntity createSupplierPayment(SupplierPaymentRequestDTO supplierPaymentDTO){
        SupplierPaymentEntity supplierPayment = new SupplierPaymentEntity();
        supplierPayment.setSupplierEmail(supplierPaymentDTO.getSupplierEmail());
        supplierPayment.setOrderRequestId(supplierPaymentDTO.getOrderRequestId());
        supplierPayment.setAmount(supplierPaymentDTO.getAmount());
        supplierPayment.setPaymentDate(supplierPaymentDTO.getPaymentDate());
        supplierPayment.setDeliveryDate(supplierPaymentDTO.getDeliveryDate());
        supplierPayment.setPaymentStatus("Ongoing");
        supplierPayment.setPaymentType(supplierPaymentDTO.getPaymentType());

        return supplierPaymentRepository.save(supplierPayment);
        
    }



}
