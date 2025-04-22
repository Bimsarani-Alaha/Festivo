package com.example.festivo.dto.SupplierOrderRequestdto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SupplierReqDTO {
    private String eventName;
    private String eventPackage;
    private String eventTheme;
    private String eventType;
    private Integer noOfGuest;
    private String specialRequest;
    private Date eventDate;
    private String eventId;

}
