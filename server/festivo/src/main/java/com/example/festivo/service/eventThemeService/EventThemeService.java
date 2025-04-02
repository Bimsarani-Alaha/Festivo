package com.example.festivo.service.eventThemeService;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.festivo.dto.EventThemeDTO.EventThemeRequestDTO;
import com.example.festivo.dto.EventThemeDTO.EventThemeResponseDTO;
import com.example.festivo.entity.eventEntity.EventTheme;
import com.example.festivo.repository.eventThemeRepository.EventThemRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EventThemeService {

    private final EventThemRepository eventThemeRepository;

    public EventThemeResponseDTO createEventTheme(EventThemeRequestDTO req) {

        EventTheme eventTheme = new EventTheme();
        eventTheme.setEventName(req.getEventName());
        eventTheme.setThemeName(req.getThemeName());
        eventTheme.setPrice(req.getPrice());

        EventTheme saved = eventThemeRepository.save(eventTheme);

        if (saved.getId() == null)
            return new EventThemeResponseDTO(null, "System Error");

        return new EventThemeResponseDTO("Event Saved Success", null);
    }

    public List<EventTheme> getAllEventThemes() {
        return eventThemeRepository.findAll();
    }
}
