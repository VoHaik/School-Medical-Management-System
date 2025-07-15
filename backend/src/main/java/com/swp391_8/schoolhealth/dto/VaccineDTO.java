package com.swp391_8.schoolhealth.dto;

import lombok.Data;

@Data
public class VaccineDTO {
    private Integer vaccineId;
    private String name;
    private String diseaseTargeted;
    private String description;
    private String manufacturer;
    private Integer standardDoses;
}
