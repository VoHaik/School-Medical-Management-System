package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.repository.StudentVaccinationRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VaccinationRecordService {

    private final StudentVaccinationRecordRepository vaccinationRecordRepository;

    public long getTotalCount() {
        return vaccinationRecordRepository.count();
    }
}
