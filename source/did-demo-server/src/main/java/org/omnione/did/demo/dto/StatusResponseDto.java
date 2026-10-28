package org.omnione.did.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class StatusResponseDto {
    private String sessionId;
    private String protocol;
    private String status;
    private String error;
    private String format;
    private List<Claim> claims;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Claim {
        private String caption;
        private String value;
    }
}
