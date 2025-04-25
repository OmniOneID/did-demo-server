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

package org.omnione.did.demo.controller;

import com.google.zxing.WriterException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.omnione.did.demo.dto.*;
import org.omnione.did.demo.service.DemoService;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;


/**
 * Demo data controller for handling Verifiable Credentials (VCs) and Verifiable Presentations (VPs)
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value ="/demo")
public class DemoDataController {
    private final DemoService demoService;

    @RequestMapping(value = "/api/vp-offer-refresh-call", method = RequestMethod.POST)
    @ResponseBody
    public VpResultDto vpOfferRefresh() throws IOException, WriterException {
        return demoService.vpOfferRefresh();
    }

    @RequestMapping(value = "/api/vc-offer-refresh-call", method = RequestMethod.POST)
    @ResponseBody
    public VcResultDto vcOfferRefresh() throws IOException, WriterException {
        return demoService.vcOfferRefresh();
    }
    @RequestMapping(value = "/api/vc-offer-submit", method = RequestMethod.POST)
    @ResponseBody
    public RequestVcSubmitResDto vcOfferSubmit(@RequestBody RequestVcSubmitReqDto requestVcSubmitReqDto) {
        return demoService.vcOfferSubmit(requestVcSubmitReqDto);
    }
    @RequestMapping(value = "/api/vc-offer-push", method = RequestMethod.POST)
    @ResponseBody
    public VcOfferPushResDto vcOfferPush(@RequestBody RequestVcOfferReqDto requestVcOfferReqDto) {
        return demoService.vcOfferPush(requestVcOfferReqDto);
    }

    @RequestMapping(value = "/api/vc-offer-email", method = RequestMethod.POST)
    @ResponseBody
    public RequestVcOfferResDto vcOfferEmail(@RequestBody RequestVcOfferReqDto requestVcOfferReqDto) {
        return demoService.vcOfferEmail(requestVcOfferReqDto);
    }

    @RequestMapping(value = "/api/save-user-info", method = RequestMethod.POST)
    @ResponseBody
    public SaveUserInfoResDto saveUserInfo(@RequestBody SaveUserInfoReqDto saveUserInfoReqDto) {
        return demoService.saveUserInfo(saveUserInfoReqDto);
    }

    @RequestMapping(value = "/api/save-vc-info", method = RequestMethod.POST)
    @ResponseBody
    public SaveUserInfoResDto saveVcInfo(@RequestBody SaveVcInfoReqDto saveVcInfoReqDto){
        return demoService.saveVcInfo(saveVcInfoReqDto);
    }

    @RequestMapping(value = "/api/issue-vc-result", method = RequestMethod.POST)
    @ResponseBody
    public IssueVcResultResDto issueVcResult(@RequestBody IssueVcResultReqDto issueVcResultReqDto) {
        return demoService.issueVcResult(issueVcResultReqDto);
    }

    @RequestMapping(value = "/api/confirm-verify", method = RequestMethod.POST)
    @ResponseBody
    public ConfirmVerifyResDto confirmVerify(@RequestBody ConfirmVerifyReqDto confirmVerifyReqDto) {
        return demoService.confirmVerify(confirmVerifyReqDto);
    }
    @RequestMapping(value = "/api/vc-schemas", method = RequestMethod.GET)
    @ResponseBody
    public VcSchemaResponseDto getVcSchemas() {
        return demoService.getVcSchemas();
    }

    @RequestMapping(value = "/api/vc-schema/{schemaId}", method = RequestMethod.GET)
    @ResponseBody
    public VcSchemaResponseDto.VcSchemaDto getVcSchema(@PathVariable("schemaId") String schemaId) {
        return demoService.getVcSchema(schemaId);
    }


}
