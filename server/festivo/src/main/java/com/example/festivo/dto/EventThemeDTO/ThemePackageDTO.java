package com.example.festivo.dto.EventThemeDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ThemePackageDTO {
    private String packageName;
    private double packagePrice;
    private String description;
    private String id;
}
