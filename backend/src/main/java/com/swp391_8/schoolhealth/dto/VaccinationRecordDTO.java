package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class VaccinationRecordDTO {
    private Long recordId;
    private Long declarationId; // Only if needed, usually managed by the parent HealthDeclarationDTO
    private String vaccineName;
    private LocalDate vaccinationDate;
    private Integer doseNumber;
    private String notes;
    private String dosage;

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }
}
