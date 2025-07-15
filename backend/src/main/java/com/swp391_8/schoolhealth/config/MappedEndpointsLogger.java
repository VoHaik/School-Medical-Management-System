package com.swp391_8.schoolhealth.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.Map;

/**
 * This class logs all controller-mapped endpoints at application startup
 * to help diagnose potential routing issues.
 */
@Component
public class MappedEndpointsLogger implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(MappedEndpointsLogger.class);

    @Autowired
    private RequestMappingHandlerMapping requestMappingHandlerMapping;

    @Override
    public void run(String... args) {
        logger.info("========== MAPPED API ENDPOINTS ==========");
        Map<RequestMappingInfo, HandlerMethod> handlerMethods = requestMappingHandlerMapping.getHandlerMethods();
        
        // Log all controller mapped endpoints
        handlerMethods.forEach((key, value) -> {
            logger.info("{} => {}.{}()", 
                    key, 
                    value.getBeanType().getSimpleName(), 
                    value.getMethod().getName());
        });
        
        // Specifically highlight medication request endpoints
        logger.info("========== MEDICATION REQUEST ENDPOINTS ==========");
        handlerMethods.forEach((key, value) -> {
            if (key.toString().contains("medication-requests")) {
                logger.info("{} => {}.{}()", 
                        key, 
                        value.getBeanType().getSimpleName(), 
                        value.getMethod().getName());
            }
        });
        
        logger.info("=============================================");
    }
}
