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

package org.omnione.did.demo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.WriterException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.omnione.did.base.config.ConfigService;
import org.omnione.did.crypto.enums.MultiBaseType;
import org.omnione.did.demo.api.*;
import org.omnione.did.base.exception.ErrorCode;
import org.omnione.did.base.exception.OpenDidException;
import org.omnione.did.demo.dto.*;

import org.omnione.did.demo.util.BaseDigestUtil;
import org.omnione.did.demo.util.BaseMultibaseUtil;
import org.omnione.did.demo.util.HexUtil;
import org.omnione.did.demo.util.JsonUtil;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.omnione.did.demo.util.QrMaker.*;

/**
 * This is a sample implementation for testing purposes.
 * This implementation does not actually perform any verification, but instead returns dummy data.
 */
@RequiredArgsConstructor
@Slf4j
@Service
@Profile("!sample")
public class DemoServiceImpl implements DemoService{
    private final VerifierFeign verifierFeign;
    private final TasFeign tasFeign;
    private final CasFeign casFeign;
    private final IssuerFeign issuerFeign;
    private final IssuerAdminFeign issuerAdminFeign;
    private final ConfigService configService;
    private final ListFeign listFeign;
    private final ObjectMapper objectMapper;

    /**
     * Refreshes the Verifiable Presentation (VP) offer.
     * This method requests a VP offer from the Verifier and returns the offer as a QR code.
     *
     * @return VpResultDto containing the VP offer as a QR code
     */
    @Override
    public VpResultDto vpOfferRefresh(){
        try {
            RequestVpOfferReqDto offerReqDto = RequestVpOfferReqDto.builder()
                    .policyId(configService.getConfig().getCurrentVpPolicy())
                    .build();
            RequestVpOfferResDto requestVpOfferResDto = verifierFeign.requestVpOfferQR(offerReqDto);
            if (requestVpOfferResDto == null) {
                throw new OpenDidException(ErrorCode.VP_OFFER_NOT_FOUND);
            }
            String jsonString = JsonUtil.serializeAndSort(requestVpOfferResDto.getPayload());
            String encDataPayload = BaseMultibaseUtil.encode(jsonString.getBytes(), MultiBaseType.base64);
            VpResultDto vpResultDto = VpResultDto.builder()
                    .payloadType("SUBMIT_VP")
                    .payload(encDataPayload)
                    .validUntil(requestVpOfferResDto.getPayload().getValidUntil())
                    .build();
            QrImageData qrImageData = makeQrImage(vpResultDto);
            vpResultDto.setQrImage(qrImageData.getQrIamge());
            vpResultDto.setOfferId(requestVpOfferResDto.getPayload().getOfferId());
            return vpResultDto;

        } catch (OpenDidException e){
            throw e;
        } catch (IOException | WriterException e) {
            throw new OpenDidException(ErrorCode.JSON_PROCESSING_ERROR);
        }

    }

    /**
     * Refreshes the Verifiable Credential (VC) offer.
     * This method requests a VC offer from the TAS and returns the offer as a QR code.
     *
     * @return VcResultDto containing the VC offer as a QR code
     */
    @Override
    public VcResultDto vcOfferRefresh() throws IOException, WriterException {
        RequestVcOfferReqDto vcOfferReqDto = RequestVcOfferReqDto.builder()
                .vcPlanId(configService.getConfig().getCurrentVcPlan())
                .issuer(configService.getConfig().getIssuer())
                .build();

        RequestVcOfferResDto requestVcOfferResDto = tasFeign.requestVcOfferQR(vcOfferReqDto);
        String jsonString = JsonUtil.serializeAndSort(requestVcOfferResDto.getIssueOfferPayload());
        String encDataPayload = BaseMultibaseUtil.encode(jsonString.getBytes(), MultiBaseType.base64);
        VcResultDto vcResultDto = VcResultDto.builder()
                .payloadType("ISSUE_VC")
                .payload(encDataPayload)
                .build();
        QrImageData qrImageData = makeQrImage(vcResultDto);
        vcResultDto.setQrImage(qrImageData.getQrIamge());
        vcResultDto.setValidUntil(requestVcOfferResDto.getValidUntil());
        vcResultDto.setOfferId(requestVcOfferResDto.getOfferId());
        return vcResultDto;
    }

    /**
     * Submits the Verifiable Credential (VC) offer.
     * This method submits the VC offer to the TAS and returns the result.
     *
     * @param requestVcSubmitReqDto the VC offer to submit
     * @return RequestVcSubmitResDto containing the result of the submission
     */
    @Override
    public RequestVcSubmitResDto vcOfferSubmit(RequestVcSubmitReqDto requestVcSubmitReqDto) {
        return tasFeign.requestVcSubmitConfirm(requestVcSubmitReqDto);
    }

    /**
     * Pushes the Verifiable Credential (VC) offer.
     * This method pushes the VC offer to the TAS and returns the result.
     *
     * @param requestVcOfferReqDto the VC offer to push
     * @return VcOfferPushResDto containing the result of the push
     */
    @Override
    public VcOfferPushResDto vcOfferPush(RequestVcOfferReqDto requestVcOfferReqDto) {
        String messageId = new UUID(new SecureRandom().nextLong(), new SecureRandom().nextLong()).toString().substring(0, 8);
        VcOfferPushResDto vcOfferPushResDto = tasFeign.requestVcOfferPush(RequestVcOfferReqDto.builder()
                .holder(requestVcOfferReqDto.getDid())
                .issuer(configService.getConfig().getIssuer())
                .id(messageId)
                .vcPlanId(configService.getConfig().getCurrentVcPlan())
                .build());
        if(vcOfferPushResDto != null){
            vcOfferPushResDto.setResult("success");
        }
        return vcOfferPushResDto;
    }

    /**
     * Sends the Verifiable Credential (VC) offer via email.
     * This method sends the VC offer to the email address provided and returns the result.
     *
     * @param requestVcOfferReqDto the VC offer to send
     * @return RequestVcOfferResDto containing the result of the email send
     */
    @Override
    public RequestVcOfferResDto vcOfferEmail(RequestVcOfferReqDto requestVcOfferReqDto) {
        RequestVcOfferResDto requestVcOfferResDto =
                tasFeign.requestVcOfferEmail(RequestVcOfferReqDto.builder()
                .email(requestVcOfferReqDto.getEmail())
                .vcPlanId(configService.getConfig().getCurrentVcPlan())
                .issuer(configService.getConfig().getIssuer())
                .build());

        if(requestVcOfferResDto != null){
            requestVcOfferResDto.setResult(true);
        }
        return requestVcOfferResDto;
    }

    /**
     * Saves the user information.
     * This method saves the user information to the CAS and returns the result.
     *
     * @param saveUserInfoReqDto the user information to save
     * @return SaveUserInfoResDto containing the result of the save
     */
    @Override
    public SaveUserInfoResDto saveUserInfo(SaveUserInfoReqDto saveUserInfoReqDto) {
        try {
            String json = JsonUtil.serializeAndSort(SerializeUserInfoData.builder()
                            .firstname(saveUserInfoReqDto.getFirstname())
                            .lastname(saveUserInfoReqDto.getLastname())
                            .build());

            byte[] hashedDataBytes = BaseDigestUtil.generateHash(json.getBytes(StandardCharsets.UTF_8));
            String hexStringPii = HexUtil.toHexString(hashedDataBytes);
            saveUserInfoReqDto.setPii(hexStringPii);

            Map<String, String> fields = saveUserInfoReqDto.getFields();
            if (fields != null) {
                ObjectMapper objectMapper = new ObjectMapper();
                String userInfoJson = objectMapper.writeValueAsString(fields);
                saveUserInfoReqDto.setUserInfo(userInfoJson);
            }
            SecureRandom random = new SecureRandom();
            String userId = new UUID(random.nextLong(), random.nextLong()).toString().substring(0, 8);

            casFeign.saveUserInfo(SaveUserInfoResDto.builder()
                    .userId(userId)
                    .pii(hexStringPii)
                    .build());

            if(saveUserInfoReqDto.getVcSchemaId() != null){
                issuerAdminFeign.saveUserInfo(saveUserInfoReqDto);
            }
            saveUserInfoToConfig(saveUserInfoReqDto, userId, hexStringPii);


            return SaveUserInfoResDto.builder()
                    .userId(userId)
                    .pii(hexStringPii)
                    .build();

        } catch (JsonProcessingException e) {
            throw new OpenDidException(ErrorCode.JSON_PROCESSING_ERROR);
        }
    }


    private void saveUserInfoToConfig(SaveUserInfoReqDto dto, String userId, String pii) {

        Map<String, Object> userInfoMap = new HashMap<>();

        userInfoMap.put("firstname", dto.getFirstname());
        userInfoMap.put("lastname", dto.getLastname());
        userInfoMap.put("did", dto.getDid());
        userInfoMap.put("email", dto.getEmail());
        userInfoMap.put("userId", userId);
        userInfoMap.put("pii", pii);

        userInfoMap.put("vcSchemaId", dto.getVcSchemaId());
        userInfoMap.put("vcSchemaTitle", dto.getVcSchemaTitle());
        userInfoMap.put("vcSchemaIndex", dto.getVcSchemaIndex());

        if (dto.getFields() != null) {
            userInfoMap.put("fields", dto.getFields());
        }
        configService.saveUserInfo(userInfoMap);

    }


    /**
     * Saves the Verifiable Credential (VC) information.
     * This method saves the VC information to the CAS and returns the result.
     *
     * @param saveVcInfoReqDto the VC information to save
     * @return SaveUserInfoResDto containing the result of the save
     */
    @Override
    public SaveUserInfoResDto saveVcInfo(SaveVcInfoReqDto saveVcInfoReqDto) {
        try {
            if (saveVcInfoReqDto.getDid() == null || saveVcInfoReqDto.getDid().isEmpty()) {
                throw new OpenDidException(ErrorCode.VC_INVALID_FORMAT);
            }
            issuerFeign.saveVcInfo(saveVcInfoReqDto);
            return SaveUserInfoResDto.builder()
                    .result(true)
                    .build();
        } catch (OpenDidException e) {
            throw new OpenDidException(ErrorCode.VC_SAVE_FAILED);
        }
    }

    /**
     * Issues the Verifiable Credential (VC) result.
     * This method issues the VC result to the CAS and returns the result.
     *
     * @param issueVcResultReqDto the VC result to issue
     * @return IssueVcResultResDto containing the result of the issue
     */
    @Override
    public IssueVcResultResDto issueVcResult(IssueVcResultReqDto issueVcResultReqDto) {

        return issuerFeign.issueVcResult(issueVcResultReqDto.getOfferId());
    }

    /**
     * Confirms the verification.
     * This method confirms the verification and returns the result.
     *
     * @param confirmVerifyReqDto the verification to confirm
     * @return ConfirmVerifyResDto containing the result of the confirmation
     */
    @Override
    public ConfirmVerifyResDto confirmVerify(ConfirmVerifyReqDto confirmVerifyReqDto) {
        return verifierFeign.confirmVerify(confirmVerifyReqDto);
    }

    @Override
    public VcSchemaResponseDto getVcSchemas() {
        try {
            String jsonString = listFeign.requestVcSchemaList();

            return objectMapper.readValue(jsonString, VcSchemaResponseDto.class);

        } catch (JsonProcessingException e) {
            throw new OpenDidException(ErrorCode.VC_SCHEMA_NOT_FOUND);
        }
    }

    @Override
    public VcSchemaResponseDto.VcSchemaDto getVcSchema(String schemaName) {
        try {
            String jsonString = listFeign.  requestVcSchemaList();
            VcSchemaResponseDto vcSchemas = objectMapper.readValue(jsonString, VcSchemaResponseDto.class);

            return vcSchemas.getVcSchemaList().stream()
                    .filter(schema -> {
                        URL url = null;
                        try {
                            url = new URL(schema.getSchemaId());
                        } catch (MalformedURLException e) {
                            throw new RuntimeException(e);
                        }
                        String queryParams = url.getQuery();
                        if (queryParams != null) {
                            String[] params = queryParams.split("&");
                            for (String param : params) {
                                String[] keyValue = param.split("=");
                                if (keyValue.length == 2 && "name".equals(keyValue[0]) && schemaName.equals(keyValue[1])) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }).findFirst()
                    .orElseThrow(() -> new OpenDidException(ErrorCode.VC_SCHEMA_NOT_FOUND));

        } catch (JsonProcessingException e) {
            throw new OpenDidException(ErrorCode.VC_SCHEMA_NOT_FOUND);
        }
    }

    @Override
    public VcPlanResponseDto getAllVcPlans() {
        try {
            String jsonString = listFeign.requestVcPlanList();
            return objectMapper.readValue(jsonString, VcPlanResponseDto.class);
        } catch (JsonProcessingException e) {
            throw new OpenDidException(ErrorCode.VC_PLAN_NOT_FOUND);
        }
    }

    @Override
    public CredentialSchemaDto getCredentialSchema(String credentialSchemaId) {
        try {
            String jsonString = listFeign.requestCredentialSchemaList(credentialSchemaId);
            return objectMapper.readValue(jsonString, CredentialSchemaDto.class);
        } catch (JsonProcessingException e) {
            throw new OpenDidException(ErrorCode.CREDENTIAL_SCHEMA_NOT_FOUND);
        }
    }


}



