package com.swp391_8.schoolhealth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.swp391_8.schoolhealth.repository")
public class JpaConfig {
    // Spring Boot auto-configuration will handle the rest
}
