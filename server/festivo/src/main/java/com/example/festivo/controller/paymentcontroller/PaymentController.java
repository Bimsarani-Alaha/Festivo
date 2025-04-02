package com.example.festivo.controller.paymentcontroller;


import com.example.festivo.entity.paymententity.Payment;
import com.example.festivo.repository.paymentrepository.PaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PaymentController {

    @Autowired
    private PaymentRepo paymentRepo;

    @PostMapping("/public/addPayment")
    Payment addPayment(@RequestBody Payment addPayment){
        return paymentRepo.save(addPayment);
    }

    @GetMapping("/public/getAllPayment")
    List<Payment> getAllPayment(){
        return paymentRepo.findAll();
    }

    @GetMapping("/public/paymentById/{id}")
    Payment getPaymentById(@PathVariable String id){
        return paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("payment not found with ID: " + id));
    }

    @PutMapping("/public/updatePayment/{id}")
    Payment updatePayment(@RequestBody Payment updatePayment,@PathVariable String id){
        return paymentRepo.findById(id)
                .map(payment -> {
                    payment.setName(updatePayment.getName());
                    payment.setEmail(updatePayment.getEmail());
                    payment.setPhoneNumber(updatePayment.getPhoneNumber());
                    payment.setAddress(updatePayment.getAddress());
                    payment.setCardNumber(updatePayment.getCardNumber());
                    payment.setCardType(updatePayment.getCardType());
                    payment.setExpDate(updatePayment.getExpDate());
                    payment.setCvv(updatePayment.getCvv());
                    payment.setOrderSummery(updatePayment.getOrderSummery());
                    payment.setAmount(updatePayment.getAmount());

                    return paymentRepo.save(payment);
                }).orElseThrow(()->new RuntimeException("Payment not found with ID: " + id));
    }

    @DeleteMapping("/public/deletePayment/{id}")
    String deletePayment(@PathVariable String id){
        if (!paymentRepo.existsById(id)){
            throw new RuntimeException("Payment not found with ID: "+id);
        }

        paymentRepo.deleteById(id);

        return "Payment id:"+id+" has been deleted Success";
    }
}

