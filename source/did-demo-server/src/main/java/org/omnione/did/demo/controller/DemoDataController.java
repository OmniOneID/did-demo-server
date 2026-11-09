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
import java.util.Map;
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

    @RequestMapping(value = "/api/vc-offer-refresh-call", method = RequestMethod.POST)
    @ResponseBody
    public VcResultDto vcOfferRefresh(@RequestBody RequestVcOfferReqDto requestVcOfferReqDto) throws IOException, WriterException {
        return demoService.vcOfferRefresh(requestVcOfferReqDto);
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

    @PostMapping("/api/save-vc-info")
    public void saveVcInfo(@RequestBody SaveUserInfoReqDto request) {
        demoService.saveVcInfo(request);
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

    @RequestMapping(value = "/api/all-vc-plans", method = RequestMethod.GET)
    @ResponseBody
    public VcPlanResponseDto getAllVcPlans() {
        return demoService.getAllVcPlans();
    }

    @RequestMapping(value = "/api/credential-schema", method = RequestMethod.GET)
    @ResponseBody
    public CredentialSchemaDto getCredentialSchema(@RequestParam String credentialSchemaId) {
        return demoService.getCredentialSchema(credentialSchemaId);
    }

    @GetMapping("/api/user-query-type")
    @ResponseBody
    public Map<String, String> getUserQueryType(@RequestParam String vcSchemaId) {
        String type = demoService.getUserQueryType(vcSchemaId);
        return Map.of("userQueryType", type);
    }

    @RequestMapping(value = "/api/initiate-verification", method = RequestMethod.POST)
    @ResponseBody
    public VpResultDto initiateVerification(@RequestBody java.util.Map<String, String> body) throws IOException, com.google.zxing.WriterException {
        String policyId = body.get("policyId");
        return demoService.initiateVerification(policyId);
    }

    @RequestMapping(value = "/api/verification-status/{sessionId}", method = RequestMethod.GET)
    @ResponseBody
    public StatusResponseDto getVerificationStatus(@PathVariable("sessionId") String sessionId) {
        return demoService.getVerificationStatus(sessionId);
    }
}
