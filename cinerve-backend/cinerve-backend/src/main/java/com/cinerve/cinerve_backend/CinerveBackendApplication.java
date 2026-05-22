package com.cinerve.cinerve_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CinerveBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(CinerveBackendApplication.class, args);
    }
}