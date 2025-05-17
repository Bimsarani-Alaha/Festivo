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

    public List<SupplierPaymentEntity> getSupplierPaymentByProductId(String productId){
        return supplierPaymentRepository.findByProductId(productId);
    }

    public List<SupplierPaymentEntity> getSupplierPaymentBySupplierEmail(String orderId){
        return supplierPaymentRepository.findByOrderRequestId(orderId);
    }

    public List<SupplierPaymentEntity> getSupplierPaymentByOrderId(String supplierEmail){
        return supplierPaymentRepository.findBySupplierEmail(supplierEmail);
    }

    public SupplierPaymentEntity createSupplierPayment(SupplierPaymentRequestDTO supplierPaymentDTO){
        SupplierPaymentEntity supplierPayment = new SupplierPaymentEntity();
        supplierPayment.setSupplierEmail(supplierPaymentDTO.getSupplierEmail());
        supplierPayment.setProductId(supplierPaymentDTO.getProductId());
        supplierPayment.setOrderRequestId(supplierPaymentDTO.getOrderRequestId());
        supplierPayment.setAmount(supplierPaymentDTO.getAmount());
        supplierPayment.setPaymentDate(supplierPaymentDTO.getPaymentDate());
        supplierPayment.setDeliveryDate(supplierPaymentDTO.getDeliveryDate());
        supplierPayment.setPaymentStatus(supplierPaymentDTO.getPaymentStatus());
        supplierPayment.setPaymentType(supplierPaymentDTO.getPaymentType());

        return supplierPaymentRepository.save(supplierPayment);        
    }

    public SupplierPaymentEntity updateSupplierPayment(String id, SupplierPaymentRequestDTO supplierPaymentDTO){
        return supplierPaymentRepository.findById(id)
                .map(existingPayment -> {
                    existingPayment.setSupplierEmail(supplierPaymentDTO.getSupplierEmail());
                    existingPayment.setPaymentStatus(supplierPaymentDTO.getPaymentStatus());
                    existingPayment.setDeliveryDate(supplierPaymentDTO.getDeliveryDate());;

                    return supplierPaymentRepository.save(existingPayment);
                })
                .orElseThrow(() -> new RuntimeException("Supplier Payment not found with id: " + id));                            
    }



}
