/*
 * Copyright 2024 OmniOne.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.omnione.did.demo.dto;

import lombok.*;

import java.util.List;

/**
 * DTO for confirming verification.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ConfirmVerifyResDto {
    private String vc;
    private String issuer;
    private List<Claim> claims;
    private boolean result;
    @Getter
    @Setter
    public static class Claim {
        private String caption;
        private String code;
        private String format;
        private boolean hideValue;
        private String type;
        private String value;
    }
}
