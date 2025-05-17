package com.example.festivo.service.supplierProductService;

import org.springframework.stereotype.Service;
import com.example.festivo.dto.supplierProductsDto.SupplierProductRequestDTO;
import com.example.festivo.entity.suplierEntity.SupplierProductEntity;
import com.example.festivo.repository.supplierProductRepository.SupplierProductRepository;
import java.util.List;

@Service
public class SupplierProductService {

    private final SupplierProductRepository supplierProductRepository;

    
    public SupplierProductService(SupplierProductRepository supplierProductRepository) {
        this.supplierProductRepository = supplierProductRepository;
    }

    public List<SupplierProductEntity> getAllSupplierProducts() {
        return supplierProductRepository.findAll();
    }

    public SupplierProductEntity addSupplierProduct(SupplierProductRequestDTO productDTO) {
        SupplierProductEntity product = new SupplierProductEntity();
        product.setSupplierEmail(productDTO.getSupplierEmail());
        product.setProductName(productDTO.getProductName());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setDescription(productDTO.getDescription());
        product.setImageUrl(productDTO.getImageUrl());
        return supplierProductRepository.save(product);
    }

    public SupplierProductEntity updateSupplierProduct(String id, SupplierProductRequestDTO productDTO) {
        return supplierProductRepository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setProductName(productDTO.getProductName());
                    existingProduct.setPrice(productDTO.getPrice());
                    existingProduct.setQuantity(productDTO.getQuantity());
                    existingProduct.setDescription(productDTO.getDescription());
                    existingProduct.setImageUrl(productDTO.getImageUrl());
                    return supplierProductRepository.save(existingProduct);
                })
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<SupplierProductEntity> getSupplierProducts(String email) {
        return supplierProductRepository.findBySupplierEmail(email);
    }

    public void deleteSupplierProduct(String id) {
        supplierProductRepository.deleteById(id);
    }

    public List<SupplierProductEntity> getProductsBySupplierEmail(String email) {
        return supplierProductRepository.findBySupplierEmail(email);
    }
}