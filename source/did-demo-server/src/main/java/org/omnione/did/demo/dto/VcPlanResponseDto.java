package org.omnione.did.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class VcPlanResponseDto {
    private int count;
    private List<VcPlanDto> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VcPlanDto {
        private String vcPlanId;
        private String name;
        private String description;
        private String manager;
        private CredentialSchema credentialSchema;
        private Option option;
        private CredentialDefinition credentialDefinition;

        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @ToString
        @Builder
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class CredentialSchema {
            private String id;
            private String type;
        }

        @Getter
        @Setter
        @NoArgsConstructor
        @ToString
        @Builder
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Option {
        }

        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @ToString
        @Builder
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class CredentialDefinition {
            private String id;
            private String schemaId;
        }
    }
}
