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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * The TasFeign interface is a Feign client that provides endpoints for requesting a VC offer and submitting a VC.
 * It is used to communicate with the TAS service.
 */
@FeignClient(value = "Tas", url = "${dynamic.tas.url:${tas.url}}", path = "tas/api/v1")
public interface TasFeign {
    @RequestMapping(value = "/offer-issue-vc/qr", method = RequestMethod.POST)
    RequestVcOfferResDto requestVcOfferQR(@RequestBody RequestVcOfferReqDto requestVcOfferReqDto);

    @RequestMapping(value = "/offer-issue-vc/push", method = RequestMethod.POST)
    VcOfferPushResDto requestVcOfferPush(@RequestBody RequestVcOfferReqDto requestVcOfferReqDto);

    //vcOfferEmail
    @RequestMapping(value = "/offer-issue-vc/email", method = RequestMethod.POST)
    RequestVcOfferResDto requestVcOfferEmail(@RequestBody RequestVcOfferReqDto requestVcOfferReqDto);


    @RequestMapping(value = "/issue-vc/result", method = RequestMethod.POST)
    RequestVcSubmitResDto requestVcSubmitConfirm(RequestVcSubmitReqDto requestVcSubmitReqDto);


}
