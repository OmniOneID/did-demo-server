package org.omnione.did.demo.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DynamicFeignConfiguration {
    
    private final Environment environment;

}
