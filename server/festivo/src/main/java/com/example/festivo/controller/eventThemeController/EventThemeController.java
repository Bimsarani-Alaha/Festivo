package com.example.festivo.controller.eventThemeController;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
    public ResponseEntity<EventThemeResponseDTO> createProducts(
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
}
