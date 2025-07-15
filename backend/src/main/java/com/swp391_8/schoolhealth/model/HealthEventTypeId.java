package com.swp391_8.schoolhealth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthEventTypeId implements Serializable {
    private Integer eventId;
    private Integer checkupTypeId;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HealthEventTypeId)) return false;
        HealthEventTypeId that = (HealthEventTypeId) o;
        return eventId.equals(that.eventId) && checkupTypeId.equals(that.checkupTypeId);
    }
    
    @Override
    public int hashCode() {
        return eventId.hashCode() + checkupTypeId.hashCode();
    }
}
