package com.example.festivo.entity.eventEntity;

import java.util.List;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "eventhemes")
public class EventTheme {

    @Indexed
    private String id;
    
    private String eventName;
    private String themeName;
    private String color;
    private Double price;
    private String description;
    private String img;
    private List<ThemePackage> themePackage;

}
