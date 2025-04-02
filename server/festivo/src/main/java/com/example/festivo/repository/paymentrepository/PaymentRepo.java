package com.example.festivo.repository.paymentrepository;

import com.example.festivo.entity.paymententity.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRepo extends MongoRepository<Payment,String> {
}
