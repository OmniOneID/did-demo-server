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

/**
 * DTO for the Issuer issue-profile response.
 * Matches the GetIssueProfileResDto structure returned by GET /issuer/admin/v1/issue-profiles/by-vc-schema.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class IssueProfileResDto {
    private String vcSchemaName;
    private IssueProfileData issueProfile;

    public String getUserQueryType() {
        if (issueProfile == null) return null;
        return issueProfile.getUserQueryType();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @ToString
    public static class IssueProfileData {
        private String userQueryType;
    }
}
