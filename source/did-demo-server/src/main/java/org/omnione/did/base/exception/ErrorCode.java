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

package org.omnione.did.base.exception;

public enum ErrorCode {
    UNKNOWN_SERVER_ERROR("9999", "An unknown server error has occurred.", 500),
    TODO_CODE("9998", "This is temporary error code.", 400),
    VC_SAVE_FAILED("8001", "Failed to save VC data.", 500),
    VC_INVALID_FORMAT("8002", "DID and userName not Found.", 400),
    VP_OFFER_NOT_FOUND("8003", "VP offer not found.", 404),
    JSON_PROCESSING_ERROR("8004", "Error occurred while processing JSON data.", 400),
    VC_PLAN_NOT_FOUND("8005", "VC plan not found.", 404),
    VC_SCHEMA_NOT_FOUND("8006", "VC Schema not found", 400 ),
    CREDENTIAL_SCHEMA_NOT_FOUND("8007", "Credential schema not found", 400),;

    private final String code;
    private final String message;
    private final int httpStatus;

    ErrorCode(String code, String message, int httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public static String getMessageByCode(String code) {
        for (ErrorCode errorCode : values()) {
            if (errorCode.getCode().equals(code)) {
                return errorCode.getMessage();
            }
        }
        return "Unknown error code: " + code;
    }

    @Override
    public String toString() {
        return String.format("ErrorCode{code='%s', message='%s', httpStatus=%d}", code, message, httpStatus);
    }
}
