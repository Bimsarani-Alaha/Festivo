package com.example.festivo.repository.eventThemeRepository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.festivo.entity.eventEntity.EventTheme;

public interface EventThemRepository extends MongoRepository<EventTheme, String> {
    List<EventTheme> findByEventName(String eventName);

    EventTheme findByThemeName(String eventName);

}
