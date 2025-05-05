package com.example.festivo.controller.eventThemeController;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.festivo.dto.EventThemeDTO.EventThemeRequestDTO;
import com.example.festivo.dto.EventThemeDTO.EventThemeResponseDTO;
import com.example.festivo.entity.eventEntity.EventTheme;
import com.example.festivo.service.eventThemeService.EventThemeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/public/event-theme")
@RequiredArgsConstructor
public class EventThemeController {

    private final EventThemeService eventThemeService;

    @PostMapping
    public ResponseEntity<EventThemeResponseDTO> createEventTheme(
            @RequestBody EventThemeRequestDTO req) {
        EventThemeResponseDTO res = eventThemeService.createEventTheme(req);
        if (res.getError() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        } else {
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        }
    }

    @GetMapping
    public List<EventTheme> getAllThemes() {
        return eventThemeService.getAllEventThemes();
    }

    @GetMapping("/{event}")
    public List<EventTheme> getAllEventThemes(
            @PathVariable String event) {
        return eventThemeService.getThemeByEvent(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventThemeResponseDTO> updateEventTheme(
            @PathVariable String id,
            @RequestBody EventThemeRequestDTO req) {
        EventThemeResponseDTO res = eventThemeService.updateEventTheme(id, req);
        if (res.getError() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        } else {
            return ResponseEntity.ok(res);
        }
    }

    @DeleteMapping("/{id}/{eventName}")
    public ResponseEntity<Void> deleteEventTheme(@PathVariable String id, @PathVariable String eventName) {
        String deleted = eventThemeService.deleteEventTheme(id, eventName);
        if (deleted.equals("OK")) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else if (deleted.equals("Not Found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else if (deleted.equals("Can not Delete This Event Theme")){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
