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

package org.omnione.did.demo.api;
import org.omnione.did.demo.dto.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * The VerifierFeign interface is a Feign client that provides endpoints for requesting a VP offer and submitting a VP.
 * It is used to communicate with the Verifier service.
 */
@FeignClient(value = "Verifier", url = "${dynamic.verifier.url:${verifier.url}}", path = "/verifier")
public interface VerifierFeign {
    @RequestMapping(value = "/api/v1/request-offer-qr", method = RequestMethod.POST)
    RequestVpOfferResDto requestVpOfferQR(@RequestBody RequestVpOfferReqDto requestVpOfferReqDto);

    @RequestMapping(value = "/api/v1/confirm-verify", method = RequestMethod.POST)
    ConfirmVerifyResDto confirmVerify(@RequestBody ConfirmVerifyReqDto confirmVerifyReqDto);

    @RequestMapping(value = "/admin/v1/policies/all", method = RequestMethod.GET)
    List<VpPolicyResponseDto> getPolicies();

}
