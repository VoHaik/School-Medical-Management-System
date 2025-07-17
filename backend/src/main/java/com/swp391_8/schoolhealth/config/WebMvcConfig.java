package com.swp391_8.schoolhealth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.resource.ResourceHttpRequestHandler;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * WebMvcConfig - This configuration class explicitly defines what should be treated
 * as static resources to avoid API endpoints being mistaken for static resources.
 * 
 * The key fix here is explicitly configuring resources and making them lower priority
 * than controller-mapped endpoints.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Explicitly define the ONLY paths that should be treated as static resources
        registry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/css/");
        registry.addResourceHandler("/js/**").addResourceLocations("classpath:/static/js/");
        registry.addResourceHandler("/images/**").addResourceLocations("classpath:/static/images/");
        registry.addResourceHandler("/*.html").addResourceLocations("classpath:/static/");
        registry.addResourceHandler("/favicon.ico").addResourceLocations("classpath:/static/favicon.ico");
        registry.addResourceHandler("/logo192.png").addResourceLocations("classpath:/static/logo192.png");
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
        
        // Make sure static resources have LOWER priority than API endpoints
        registry.setOrder(Ordered.LOWEST_PRECEDENCE);
    }
    
    /**
     * Explicitly prevent /api/** paths from being handled as static resources
     */
    @Bean
    public HandlerMapping customResourceHandlerMapping() {
        SimpleUrlHandlerMapping handlerMapping = new SimpleUrlHandlerMapping();
        Map<String, ResourceHttpRequestHandler> resourceMap = Collections.emptyMap();
        handlerMapping.setUrlMap(resourceMap);
        handlerMapping.setOrder(Ordered.HIGHEST_PRECEDENCE); // Set higher priority
        return handlerMapping;
    }
}
