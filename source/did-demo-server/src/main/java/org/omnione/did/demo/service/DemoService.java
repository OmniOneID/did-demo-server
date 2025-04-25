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

import com.google.zxing.WriterException;
import org.omnione.did.demo.dto.*;
import java.io.IOException;

/**
 * Demo service interface for handling Verifiable Credentials (VCs) and Verifiable Presentations (VPs)
 */
public interface DemoService {

    VpResultDto vpOfferRefresh() throws IOException, WriterException;
    VcResultDto vcOfferRefresh() throws IOException, WriterException;
    RequestVcSubmitResDto vcOfferSubmit(RequestVcSubmitReqDto requestVcSubmitReqDto);
    VcOfferPushResDto vcOfferPush(RequestVcOfferReqDto requestVcOfferReqDto);
    RequestVcOfferResDto vcOfferEmail(RequestVcOfferReqDto requestVcOfferReqDto);
    SaveUserInfoResDto saveUserInfo(SaveUserInfoReqDto saveUserInfoReqDto);
    SaveUserInfoResDto saveVcInfo(SaveVcInfoReqDto saveUserInfoReqDto);
    IssueVcResultResDto issueVcResult(IssueVcResultReqDto issueVcResultReqDto);
    ConfirmVerifyResDto confirmVerify(ConfirmVerifyReqDto confirmVerifyReqDto);
    VcSchemaResponseDto getVcSchemas();
    VcSchemaResponseDto.VcSchemaDto getVcSchema(String schemaId);

}
