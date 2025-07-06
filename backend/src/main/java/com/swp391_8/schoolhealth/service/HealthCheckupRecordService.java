package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.repository.HealthCheckupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HealthCheckupRecordService {

    private final HealthCheckupRepository healthCheckupRepository;

    public long getTotalCount() {
        return healthCheckupRepository.count();
    }
}
