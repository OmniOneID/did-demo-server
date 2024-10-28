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

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.omnione.did.base.datamodel.enums.PresentMode;


/**
 * DTO for VP Offer request.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class RequestVpOfferReqDto {
    private String id;
    @NotNull(message = "mode cannot be null")
    @Schema(example = "Direct")
    private PresentMode mode;
    @NotNull(message = "device cannot be null")
    @Schema(example = "app")
    private String device;
    @Schema(example = "11st")
    @NotNull(message = "service cannot be null")
    private String service;
    @Min(value = 1, message = "validSeconds must be greater than 0")
    @Builder.Default
    private int validSeconds = 180;
}
