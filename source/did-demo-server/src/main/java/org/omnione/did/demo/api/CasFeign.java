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

import org.omnione.did.demo.dto.SaveUserInfoResDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * The CasFeign interface is a Feign client that provides endpoints for saving user information.
 * It is used to communicate with the CAS service.
 */
@FeignClient(value = "Cas", url = "${dynamic.cas.url:${cas.url}}", path = "/cas/api/v1")
public interface CasFeign {
        @RequestMapping(value = "/save-user-info", method = RequestMethod.POST)
        void saveUserInfo(@RequestBody SaveUserInfoResDto saveUserInfoResDto);
}
