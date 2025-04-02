package com.example.festivo.repository.eventThemeRepository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.festivo.entity.eventEntity.EventTheme;


public interface EventThemRepository extends MongoRepository<EventTheme, String>{

}
