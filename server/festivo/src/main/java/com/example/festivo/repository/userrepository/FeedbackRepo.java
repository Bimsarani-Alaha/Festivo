package com.example.festivo.repository.userrepository;


import com.example.festivo.entity.userentity.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeedbackRepo extends MongoRepository<Feedback,String> {
}