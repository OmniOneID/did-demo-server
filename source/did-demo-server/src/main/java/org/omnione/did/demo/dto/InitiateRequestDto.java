package org.omnione.did.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InitiateRequestDto {
    private String policyId;
}
