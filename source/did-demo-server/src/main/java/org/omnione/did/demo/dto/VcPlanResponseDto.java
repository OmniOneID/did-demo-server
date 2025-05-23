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
        private List<String> tags;
        private CredentialSchema credentialSchema;
        private Option option;
        private List<String> allowedIssuers;
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
        @AllArgsConstructor
        @ToString
        @Builder
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Option {
            private boolean allowUserInit;
            private boolean allowIssuerInit;
            private boolean delegatedIssuance;
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
