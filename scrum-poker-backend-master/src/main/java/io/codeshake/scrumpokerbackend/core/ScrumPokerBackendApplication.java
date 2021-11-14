package io.codeshake.scrumpokerbackend.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("io.codeshake.scrumpokerbackend")
public class ScrumPokerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScrumPokerBackendApplication.class, args);
    }
}
