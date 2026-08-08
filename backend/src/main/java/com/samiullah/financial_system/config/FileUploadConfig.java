package com.samiullah.financial_system.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Value("${upload.folder}")
    private String uploadFolder;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadFolder + "/../");
    }
}