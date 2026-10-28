package org.omnione.did.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class InitiateResponseDto {
    private String protocol;
    private String sessionId;
    private Object payload;
    private String authorizationRequest;
}
