package org.omnione.did.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ServerSettingsDto {
    private String tasServer;
    private String issuerServer;
    private String caServer;
    private String verifierServer;
}