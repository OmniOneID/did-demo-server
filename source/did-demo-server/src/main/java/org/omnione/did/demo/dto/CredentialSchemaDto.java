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
public class CredentialSchemaDto {
    private String id;
    private String name;
    private String version;
    private List<String> attrNames;
    private List<AttrType> attrTypes;
    private String tag;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AttrType {
        private Namespace namespace;
        private List<Item> items;

        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @ToString
        @Builder
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Namespace {
            private String id;
            private String name;
        }

        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @ToString
        @Builder
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Item {
            private String label;
            private String caption;
            private String type;
        }
    }
}
