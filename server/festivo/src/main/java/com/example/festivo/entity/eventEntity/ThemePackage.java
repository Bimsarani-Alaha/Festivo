package com.example.festivo.entity.eventEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ThemePackage {
    private String packageName;
    private double packagePrice;
    private String description;
    private String id;
}
