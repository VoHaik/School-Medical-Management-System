package com.swp391_8.schoolhealth.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.Map;

/**
 * Logs all mapped endpoints at startup to help debug routing issues
 */
@Component
public class EndpointMappingLogger implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(EndpointMappingLogger.class);

    @Autowired
    private RequestMappingHandlerMapping requestMappingHandlerMapping;

    @Override
    public void run(String... args) throws Exception {
        logger.info("=========== API ENDPOINTS MAPPING ===========");
        Map<RequestMappingInfo, HandlerMethod> handlerMethods = requestMappingHandlerMapping.getHandlerMethods();
        
        handlerMethods.forEach((mappingInfo, handlerMethod) -> {
            logger.info("{} -> {}.{}",
                    mappingInfo,
                    handlerMethod.getBeanType().getSimpleName(),
                    handlerMethod.getMethod().getName());
        });
        logger.info("============================================");
    }
}
