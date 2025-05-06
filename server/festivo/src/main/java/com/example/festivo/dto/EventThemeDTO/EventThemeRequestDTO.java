package com.example.festivo.dto.EventThemeDTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventThemeRequestDTO {

    private String eventName;
    private String themeName;
    private String color;
    private Double price;
    private String description;
    private String img;
    private List<ThemePackageDTO> themePackage;

}
