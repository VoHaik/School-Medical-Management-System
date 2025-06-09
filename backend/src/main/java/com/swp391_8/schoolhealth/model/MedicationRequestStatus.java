package com.swp391_8.schoolhealth.model;

public enum MedicationRequestStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED,
    COMPLETED // If a request can be marked as completed after medication course is finished
}
