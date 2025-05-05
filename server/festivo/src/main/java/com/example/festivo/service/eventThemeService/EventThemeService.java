package com.example.festivo.service.eventThemeService;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.festivo.dto.EventThemeDTO.EventThemeRequestDTO;
import com.example.festivo.dto.EventThemeDTO.EventThemeResponseDTO;
import com.example.festivo.entity.eventEntity.EventTheme;
import com.example.festivo.entity.userentity.Event;
import com.example.festivo.repository.eventThemeRepository.EventThemRepository;
import com.example.festivo.repository.userrepository.EventRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EventThemeService {

    private final EventThemRepository eventThemeRepository;
    private final EventRepo eventRepo;

    public EventThemeResponseDTO createEventTheme(EventThemeRequestDTO req) {

        EventTheme eventTheme = new EventTheme();
        eventTheme.setEventName(req.getEventName());
        eventTheme.setThemeName(req.getThemeName());
        eventTheme.setColor(req.getColor());
        eventTheme.setPrice(req.getPrice());
        eventTheme.setImg(req.getImg());

        EventTheme saved = eventThemeRepository.save(eventTheme);

        if (saved.getId() == null)
            return new EventThemeResponseDTO(null, "System Error");

        return new EventThemeResponseDTO("Event Saved Success", null);
    }

    public List<EventTheme> getAllEventThemes() {
        return eventThemeRepository.findAll();
    }

    public List<EventTheme> getThemeByEvent(String event) {
        return eventThemeRepository.findByEventName(event);
    }

    public EventThemeResponseDTO updateEventTheme(String id, EventThemeRequestDTO req) {

        Optional<EventTheme> optionalEventTheme = eventThemeRepository.findById(id);

        if (optionalEventTheme.isEmpty()) {
            return new EventThemeResponseDTO(null, "Event Theme not found");
        }

        EventTheme eventTheme = optionalEventTheme.get();
        eventTheme.setEventName(req.getEventName());
        eventTheme.setThemeName(req.getThemeName());
        eventTheme.setColor(req.getColor());
        eventTheme.setPrice(req.getPrice());
        eventTheme.setImg(req.getImg());

        EventTheme updated = eventThemeRepository.save(eventTheme);

        return new EventThemeResponseDTO("Event Updated Successfully", null);
    }

    public String deleteEventTheme(String id, String eventName) {
        Optional<EventTheme> optionalEventTheme = eventThemeRepository.findById(id);
        if (optionalEventTheme.isEmpty()) {
            return "Not Found";
        }
        System.out.println("theme "+eventName);

        EventTheme eventTheme = optionalEventTheme.get();
        Event event = eventRepo.findByEventTheme(eventTheme.getThemeName());
        if (event != null && eventTheme.getEventName().equals(event.getEventName())) {
            return "Can not Delete This Event Theme";
        }

        eventThemeRepository.deleteById(id);
        return "OK";
    }

}
