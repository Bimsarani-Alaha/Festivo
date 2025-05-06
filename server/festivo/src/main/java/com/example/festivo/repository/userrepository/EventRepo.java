package com.example.festivo.repository.userrepository;


import com.example.festivo.entity.userentity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EventRepo extends MongoRepository<Event,String> {

    Event findByEventTheme(String eventName);

}
